import { describe, it, afterEach } from 'mocha';
import { handler, Input, Output, storage } from '../index';
import { stub, restore } from 'sinon';
import { strictEqual } from 'assert';
import axios from 'axios';

const executeLambda = async (url: string, name: string): Promise<Output | null> => {
  const output = await handler({ queryStringParameters: { url, name } });
  let outputBody: Output | null = null;
  if (output) {
    outputBody = JSON.parse(output.body);
  }
  return outputBody;
};

const s3UrlFile = 'https://s3fileurl.com'
const title = 'This is the title of example.com';

afterEach(restore);

describe('handler', () => {

  it('should get the html from a url', async () => {
    stub(axios, 'get').resolves({ data: `<html><head><title>${title}</title></head></html>` });
    stub(storage, 'storeHtmlFile').resolves(s3UrlFile)
    const output = await executeLambda('http://example.com', '');
    strictEqual(output.s3_url, s3UrlFile);
  });

  it('should extract and return the page title of a url', async () => {
    const name = '__file_name__';
    const html = `<html><head><title>${title}</title></head></html>`;
    stub(axios, 'get').resolves({ data: html });
    const storeHtmlStub = stub(storage, 'storeHtmlFile').resolves(s3UrlFile)
    const output = await executeLambda('http://example.com', name);
    strictEqual(output.title, title);
    strictEqual(storeHtmlStub.calledOnceWith(html, name), true);
  });

});