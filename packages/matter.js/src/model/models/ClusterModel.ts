/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mei } from "../../datatype/ManufacturerExtensibleIdentifier.js";
import { camelize, describeList } from "../../util/String.js";
import { Access } from "../aspects/Access.js";
import { Quality } from "../aspects/Quality.js";
import { SchemaImplementationError } from "../definitions/errors.js";
import { ElementTag, FeatureSet, Metatype } from "../definitions/index.js";
import { ClusterElement } from "../elements/index.js";
import { ModelTraversal } from "../logic/ModelTraversal.js";
import { ClusterRevision } from "../standard/elements/ClusterRevision.js";
import { FeatureMap } from "../standard/elements/FeatureMap.js";
import { Aspects } from "./Aspects.js";
import { AttributeModel } from "./AttributeModel.js";
import { Children } from "./Children.js";
import { CommandModel } from "./CommandModel.js";
import { DatatypeModel } from "./DatatypeModel.js";
import { EventModel } from "./EventModel.js";
import type { FieldModel } from "./FieldModel.js";
import { Model } from "./Model.js";
import { PropertyModel } from "./PropertyModel.js";

const QUALITY = Symbol("quality");

export class ClusterModel extends Model implements ClusterElement {
    override tag: ClusterElement.Tag = ClusterElement.Tag;
    declare id: Mei;
    declare classification?: ClusterElement.Classification;
    declare pics?: string;
    override isTypeScope = true;

    get diagnostics() {
        return this.effectiveQuality.diagnostics;
    }

    get quality(): Quality {
        return Aspects.getAspect(this, QUALITY, Quality);
    }
    set quality(definition: Quality | Quality.Definition) {
        Aspects.setAspect(this, QUALITY, Quality, definition);
    }
    get effectiveQuality(): Quality {
        return Aspects.getEffectiveAspect(this, QUALITY, Quality);
    }

    get attributes() {
        return this.all(AttributeModel);
    }

    get commands() {
        return this.all(CommandModel);
    }

    get events() {
        return this.all(EventModel);
    }

    get datatypes() {
        return this.all(DatatypeModel);
    }

    get members(): PropertyModel[] {
        const traversal = new ModelTraversal();

        // Formally a field element cannot be a cluster child but we allow it for metadata control when a field should
        // not be published
        const members = traversal.findMembers(this);

        // We consider the standard set of "global" attributes members of all clusters
        const missingGlobalIds = new Set(AttributeModel.globalIds);
        for (const m of members) {
            if (m instanceof AttributeModel && m.id) {
                missingGlobalIds.delete(m.id);
            }
        }

        if (missingGlobalIds.size) {
            const root = traversal.findRoot(this);
            if (root) {
                for (const id of missingGlobalIds) {
                    const global = root.get(AttributeModel, id);
                    if (global) {
                        members.push(global);
                    }
                }
            }
        }

        return members;
    }

    get activeMembers() {
        return new ModelTraversal().findActiveMembers(this, this);
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

        const featureMap = this.featureMap;

        for (const feature of featureMap.children) {
            const desc = feature.description && camelize(feature.description);
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

    override get children(): Children<ClusterModel.Child, ClusterElement.Child> {
        return super.children as any;
    }

    override set children(children: (ClusterModel.Child | ClusterElement.Child)[]) {
        super.children = children;
    }

    get effectiveMetatype() {
        return Metatype.object;
    }

    get effectiveAccess() {
        return Access.Default;
    }

    override valueOf() {
        const result = super.valueOf() as any;
        if (this.quality && !this.quality.empty) {
            result.quality = this.quality.valueOf();
        }
        return result as ClusterElement;
    }

    constructor(definition: ClusterElement.Properties) {
        super(definition);

        if (definition instanceof Model) {
            Aspects.cloneAspects(definition, this, QUALITY);
        }
    }

    static Tag = ClusterElement.Tag;

    static {
        Model.types[this.Tag] = this;
    }
}

export namespace ClusterModel {
    export type Child =
        | DatatypeModel
        | AttributeModel
        | CommandModel
        | EventModel

        // Fields are not cluster children in canonical schema but we allow
        // them as private values in operational schema
        | FieldModel;
}
