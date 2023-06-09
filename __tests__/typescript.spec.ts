import * as fs from 'fs';
import * as path from 'path';
import * as ts from '../lib/typescript';
const exampleTestFile = `const a = { b: 1 };
declare function safely(a: any): void;

function abc() {
    const c = safely(a.b);
}
console.log(abc.toString());`;
describe('typescript', () => {
    it('should apply transformer from legacy config', () => {
        const res = ts.transpileModule(exampleTestFile, {
            compilerOptions: {
                plugins: [
                    {
                        customTransformers: {
                            before: [__dirname + '/transforms/safely.ts'],
                        },
                    },
                ] as any,
            },
        });

        const result = `var a = { b: 1 };
function abc() {
    var c = a && a.b;
}
console.log(abc.toString());
`;

        expect(res.outputText).toEqual(result);
    });

    it('should apply transformer from default config', () => {
        const res = ts.transpileModule(exampleTestFile, {
            compilerOptions: {
                plugins: [
                    {
                        transform: __dirname + '/transforms/safely.ts',
                    },
                ] as any,
            },
        });

        const result = `var a = { b: 1 };
function abc() {
    var c = a && a.b;
}
console.log(abc.toString());
`;

        expect(res.outputText).toEqual(result);
    });

    it('should merge transformers', () => {
        const customTransformer = jest.fn((sf) => sf);

        const res = ts.transpileModule(exampleTestFile, {
            compilerOptions: {
                plugins: [
                    {
                        transform: __dirname + '/transforms/safely.ts',
                    },
                ] as any,
            },
            transformers: {
                before: [() => customTransformer],
            },
        });

        const result = `var a = { b: 1 };
function abc() {
    var c = a && a.b;
}
console.log(abc.toString());
`;

        expect(res.outputText).toEqual(result);
        expect(customTransformer).toHaveBeenCalled();
    });

    it('should run 3rd party transformers', () => {
        const res = ts.transpileModule('var x = 1;', {
            compilerOptions: {
                plugins: [
                    { transform: 'ts-transformer-keys/transformer' },
                    { transform: 'ts-transformer-enumerate/transformer' },
                    // { transform: 'ts-transform-graphql-tag/dist/transformer' },
                    { transform: 'ts-transform-img/dist/transform', type: 'config' },
                    { transform: 'ts-transform-css-modules/dist/transform', type: 'config' },
                    { transform: 'ts-transform-react-intl/dist/transform', type: 'config', import: 'transform' },
                    { transform: 'ts-nameof', type: 'raw' },
                ] as any,
            },
        });

        const result = `var x = 1;\n`;
        expect(res.outputText).toEqual(result);
    });
});
