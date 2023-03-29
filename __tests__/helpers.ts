import { PluginConfig, PluginCreator } from '../lib/PluginCreator';
import * as ts from 'typescript';

export function createTransformers(config: PluginConfig[]): ts.CustomTransformers {
    const pluginCreator = new PluginCreator(ts, config, __dirname);
    const host = { program: {} as ts.Program };
    return pluginCreator.createTransformers(host);
}
