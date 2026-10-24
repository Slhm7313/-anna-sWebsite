// Smoke tests for deployed page routes, local assets, compiled modules, and JSON-LD setup.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteBaseUrl = 'https://slhm7313.github.io/-anna-sWebsite/';

async function readProjectFile(relativePath) {
    return readFile(path.join(projectRoot, relativePath), 'utf8');
}

function getHtmlAttributes(tag) {
    return Object.fromEntries(
        [...tag.matchAll(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
            .map((match) => [match[1], match[2] ?? match[3]])
    );
}

test('all public pages have valid local resources and local navigation links', async () => {
    const pages = [
        'index.html',
        'report.html',
        'assets/pages/contact.html',
        'assets/pages/evroskalijis.html',
        'assets/pages/mathimata.html',
        'assets/pages/ores.html'
    ];

    for (const page of pages) {
        const html = await readProjectFile(page);
        const pageDirectory = path.dirname(path.join(projectRoot, page));
        const tags = [...html.matchAll(/<(?:a|img|script|link)\b[^>]*>/gi)].map((match) => match[0]);

        for (const tag of tags) {
            const attributes = getHtmlAttributes(tag);
            const isLink = tag.startsWith('<a');
            const isResource = tag.startsWith('<img') || tag.startsWith('<script')
                || (tag.startsWith('<link') && ['stylesheet', 'icon', 'apple-touch-icon'].includes(attributes.rel));
            const url = isLink ? attributes.href : isResource ? attributes.src ?? attributes.href : null;

            if (!url || url.startsWith('#') || /^(?:[a-z]+:|\/\/)/i.test(url)) continue;

            const localPath = decodeURIComponent(url.split(/[?#]/, 1)[0]);
            assert.ok(
                await fileExists(path.resolve(pageDirectory, localPath)),
                `${page} references missing local ${isLink ? 'page' : 'resource'}: ${url}`
            );
        }

        assert.match(html, /assets\/CSS\/error\.css|\.{2}\/CSS\/error\.css/, `${page} must load error notices`);
    }
});

test('the branded 404 page includes valid recovery destinations and needs no nested assets', async () => {
    const html = await readProjectFile('404.html');

    assert.match(html, /name="robots" content="noindex, follow"|content="noindex, follow" name="robots"/);
    assert.ok(html.includes(`href="${siteBaseUrl}"`), '404 page should link back to the site home');
    assert.ok(html.includes(`href="${siteBaseUrl}report.html"`), '404 page should link to issue reporting at the site root');
    assert.ok(html.includes('mailto:g.slimistinos.dev@gmail.com,gnwsi.2023@gmail.com'), '404 fallback should address both contacts');
    assert.match(html, /Δεν βρήκαμε αυτή τη σελίδα/);
    assert.match(html, /<style>/, '404 page should remain styled even when external resources fail');
});

test('the issue report form addresses both contacts and includes the problem context', async () => {
    const html = await readProjectFile('report.html');
    const { createProblemReportMailto } = await import('../dist/problem-report.js');
    const timestamp = new Date('2026-10-24T12:00:00.000Z');
    const mailto = createProblemReportMailto(
        'Η σελίδα δεν λειτουργεί',
        '  Η φόρμα δεν ανοίγει.  ',
        'Αναφορά προβλήματος',
        `${siteBaseUrl}report.html`,
        timestamp
    );
    const [recipients, query] = mailto.slice('mailto:'.length).split('?');
    const parameters = new URLSearchParams(query);
    const body = parameters.get('body');

    assert.match(html, /id="problem-report-form"/);
    assert.match(html, /assets\/CSS\/report\.css/);
    assert.deepEqual(recipients.split(','), ['g.slimistinos.dev@gmail.com', 'gnwsi.2023@gmail.com']);
    assert.equal(parameters.get('subject'), '[Αναφορά προβλήματος] Η σελίδα δεν λειτουργεί');
    assert.ok(body.includes('Η φόρμα δεν ανοίγει.'));
    assert.ok(body.includes(`${siteBaseUrl}report.html`));
    assert.ok(body.includes('Η σελίδα δεν λειτουργεί'));
    assert.ok(body.includes(timestamp.toLocaleString('el-GR')));
    assert.doesNotMatch(html, /maxlength|minlength/, 'the issue description should not have a length limit');
    assert.match(html, /άνοιγμα email αναφοράς/i);
});

test('the compiled application and structured-data modules are available', async () => {
    const app = await readProjectFile('dist/app.js');
    const structuredDataModule = await readProjectFile('dist/structured-data.js');
    const errorHandlerModule = await readProjectFile('dist/error-handler.js');

    assert.match(app, /from ['"]\.\/structured-data\.js['"]/);
    assert.match(app, /from ['"]\.\/error-handler\.js['"]/);
    assert.match(structuredDataModule, /application\/ld\+json/);
    assert.match(errorHandlerModule, /unhandledrejection/);
    assert.match(errorHandlerModule, /HTMLImageElement/);
});

test('organization structured data is inserted once and contains business details', async () => {
    const originalDocument = globalThis.document;
    const scripts = [];
    globalThis.document = {
        querySelector: () => scripts.length ? scripts[0] : null,
        createElement: (tagName) => ({
            tagName,
            dataset: {},
            type: '',
            textContent: ''
        }),
        head: {
            append: (script) => scripts.push(script)
        }
    };

    try {
        const { addOrganizationStructuredData } = await import('../dist/structured-data.js');
        addOrganizationStructuredData();
        addOrganizationStructuredData();

        assert.equal(scripts.length, 1, 'structured data should not be duplicated');
        assert.equal(scripts[0].type, 'application/ld+json');

        const organization = JSON.parse(scripts[0].textContent);
        assert.equal(organization['@type'], 'EducationalOrganization');
        assert.equal(organization.name, 'Φροντιστήριο Γνώση');
        assert.equal(organization.telephone, '+30698360730');
        assert.ok(organization.openingHoursSpecification.length > 0);
    } finally {
        if (originalDocument === undefined) {
            delete globalThis.document;
        } else {
            globalThis.document = originalDocument;
        }
    }
});

test('the review modal keeps its scrollbar hidden while preserving access on short screens', async () => {
    const css = await readProjectFile('assets/CSS/navbar.css');

    assert.match(css, /scrollbar-width:\s*none/);
    assert.match(css, /\.review-modal-card::-webkit-scrollbar\s*\{\s*display:\s*none/s);
    assert.match(css, /@media\s*\(max-height:\s*760px\)/);
    assert.match(css, /overflow-y:\s*auto/, 'short viewports must still allow users to reach every form field');
});

test('the public sitemap points only to existing site pages', async () => {
    const sitemap = await readProjectFile('sitemap.xml');
    const pages = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

    assert.ok(pages.length > 0, 'sitemap should contain page URLs');
    for (const pageUrl of pages) {
        assert.ok(pageUrl.startsWith(siteBaseUrl), `unexpected sitemap URL: ${pageUrl}`);
        const relativePath = new URL(pageUrl).pathname.replace('/-anna-sWebsite/', '');
        const pathToPage = relativePath || 'index.html';
        assert.ok(await fileExists(path.join(projectRoot, pathToPage)), `sitemap points to missing page: ${pageUrl}`);
    }
});

async function fileExists(filePath) {
    try {
        await readFile(filePath);
        return true;
    } catch {
        return false;
    }
}
