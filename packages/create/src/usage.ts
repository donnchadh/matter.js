/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { stdout } from "process";
import { Config } from "./config.js";
import { blue, bold, fittedTextOf, visibleWidthOf } from "./formatting.js";
import { welcome } from "./messages.js";

export const DEFAULT_TEMPLATE = "device-simple";

export async function usage() {
    welcome();
    const templates = (await Config()).templates;

    const sections = {
        Usage: {
            [`${bold("npm init @matter")}`]: `initialize with template ${blue(DEFAULT_TEMPLATE)}`,
            [`${bold("npm init @matter <name>")}`]: `initialize with template ${bold("name")}`,
            [`${bold("npm init @matter help")}`]: `show this help`,
        },

        Options: {
            [bold("--prefix=<path>")]: `initialize in directory ${bold("path")}`,
            [bold("--no-build")]: `do not build newly generated project`,
        },

        Templates: Object.fromEntries(templates.map(t => [blue(t.name), t.description])),
    };

    stdout.write(
        `Initialize a new ${bold("matter.js")} project from a project template.\n\n${formatSections(sections)}\n`,
    );
}

function formatSections(sections: Record<string, Record<string, string>>) {
    let itemWidth = 0;
    for (const section of Object.values(sections)) {
        for (const name in section) {
            const width = visibleWidthOf(name);
            if (width > itemWidth) {
                itemWidth = width;
            }
        }
    }

    const results = Array<string>();

    const descriptionWidth = stdout.columns - itemWidth - 4;

    for (const name in sections) {
        results.push(`${name}:`);

        const section = sections[name];
        for (const item in section) {
            const padding = "".padStart(itemWidth - visibleWidthOf(item));
            const description = fittedTextOf(section[item], descriptionWidth)
                .split("\n")
                .join("\n" + "".padStart(itemWidth + 2));
            results.push(`  ${item}${padding}  ${description}`);
        }

        results.push("");
    }

    return results.join("\n");
}