/**
 * @license
 * Copyright 2022-2025 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { camelize, describeList } from "#general";
import { ModelTraversal } from "#logic/ModelTraversal.js";
import { Access } from "../aspects/Access.js";
import { Quality } from "../aspects/Quality.js";
import { SchemaImplementationError } from "../common/errors.js";
import { ElementTag, FeatureSet, Metatype } from "../common/index.js";
import { ClusterElement } from "../elements/index.js";
import { ClusterRevision, FeatureMap } from "../standard/elements/definitions.js";
import { AttributeModel } from "./AttributeModel.js";
import { CommandModel } from "./CommandModel.js";
import { DatatypeModel } from "./DatatypeModel.js";
import { EventModel } from "./EventModel.js";
import type { FieldModel } from "./FieldModel.js";
import { Model } from "./Model.js";
import { ScopeModel } from "./ScopeModel.js";

export class ClusterModel extends ScopeModel<ClusterElement, ClusterModel.Child> implements ClusterElement {
    override tag: ClusterElement.Tag = ClusterElement.Tag;

    #quality: Quality;

    get diagnostics() {
        return this.effectiveQuality.diagnostics;
    }

    get quality(): Quality {
        return this.#quality;
    }
    set quality(definition: Quality | Quality.Definition) {
        this.#quality = Quality.create(definition);
    }
    get effectiveQuality(): Quality {
        return new ModelTraversal().findAspect(this, "quality", Quality) ?? this.#quality;
    }

    get attributes() {
        return this.scope.membersOf(this, { tags: [ElementTag.Attribute] }) as AttributeModel[];
    }

    get commands() {
        return this.scope.membersOf(this, { tags: [ElementTag.Command] }) as CommandModel[];
    }

    get events() {
        return this.scope.membersOf(this, { tags: [ElementTag.Event] }) as EventModel[];
    }

    get datatypes() {
        return this.scope.membersOf(this, { tags: [ElementTag.Datatype] }) as DatatypeModel[];
    }

    get classification(): ClusterElement.Classification | undefined {
        return this.resource?.classification as ClusterElement.Classification | undefined;
    }

    set classification(classification: `${ClusterElement.Classification}` | undefined) {
        if (classification || this.hasLocalResource) {
            this.localResource.classification = classification;
        }
    }

    get pics() {
        return this.hasLocalResource ? this.localResource.pics : undefined;
    }

    set pics(pics: string | undefined) {
        if (pics || this.hasLocalResource) {
            this.localResource.pics = pics;
        }
    }

    /**
     * Get attributes, commands and events whether inherited or defined directly in this model.
     */
    get allAces() {
        return this.scope.membersOf(this, { tags: [ElementTag.Attribute, ElementTag.Command, ElementTag.Event] }) as (
            | AttributeModel
            | CommandModel
            | EventModel
        )[];
    }

    get revision() {
        let revision = 1;
        const revisionAttr = this.get(AttributeModel, ClusterRevision.id);
        if (typeof revisionAttr?.default === "number") {
            revision = revisionAttr.default;
        }
        return revision;
    }

    get features() {
        return this.featureMap.children ?? [];
    }

    get featureMap() {
        return (this.member(FeatureMap.id, [ElementTag.Attribute]) as AttributeModel) ?? new AttributeModel(FeatureMap);
    }

    get featureNames(): FeatureSet {
        return new FeatureSet(this.features.map(feature => feature.name));
    }

    get supportedFeatures(): FeatureSet {
        const supported = {} as { [name: string]: boolean | undefined };
        for (const feature of this.features) {
            if (feature.default) {
                supported[feature.name] = true;
            }
        }
        return new FeatureSet(supported);
    }

    set supportedFeatures(features: FeatureSet.Definition | undefined) {
        const featureSet = new FeatureSet(features);

        let featureMap = this.featureMap;

        if (featureMap.parent !== this) {
            featureMap = featureMap.clone();
            this.children.push(featureMap);
        }

        for (const feature of featureMap.children) {
            const desc = feature.title && camelize(feature.title);
            if (desc !== undefined && featureSet.has(desc)) {
                feature.default = true;
                featureSet.delete(desc);
                continue;
            }

            if (featureSet.has(feature.name)) {
                featureSet.delete(feature.name);
                feature.default = true;
                continue;
            }

            feature.default = undefined;
        }

        if (featureSet.size) {
            throw new SchemaImplementationError(
                this,
                `Cannot set unknown feature${featureSet.size > 1 ? "s" : ""} ${describeList("and", ...featureSet)}`,
            );
        }
    }

    get effectiveMetatype() {
        return Metatype.object;
    }

    get effectiveAccess() {
        return Access.Default;
    }

    constructor(definition: ClusterModel.Definition, ...children: Model.ChildDefinition<ClusterModel>[]) {
        super(definition, ...children);

        this.#quality = Quality.create(definition.quality);
        if (!(definition instanceof Model)) {
            this.pics = definition.pics;
            this.classification = definition.classification as ClusterElement.Classification;
        }
    }

    override toElement(omitResources = false, extra?: Record<string, unknown>) {
        return super.toElement(omitResources, {
            quality: this.quality.valueOf(),
            ...extra,
        });
    }

    static Tag = ClusterElement.Tag;
}

ClusterModel.register();

export namespace ClusterModel {
    export type Definition = Model.Definition<ClusterModel> & { supportedFeatures?: FeatureSet.Definition };

    export type Child =
        | DatatypeModel
        | AttributeModel
        | CommandModel
        | EventModel

        // Fields are not cluster children in canonical schema but we allow them as private values in operational schema
        | FieldModel;
}
