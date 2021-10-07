// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { Store } from 'antd/lib/form/interface';
import getCore from 'cvat-core-wrapper';
import { ActionUnion, createAction, ThunkAction } from 'utils/redux';

const core = getCore();

export enum OrganizationActionsTypes {
    GET_ORGANIZATIONS = 'GET_ORGANIZATIONS',
    GET_ORGANIZATIONS_SUCCESS = 'GET_ORGANIZATIONS_SUCCESS',
    GET_ORGANIZATIONS_FAILED = 'GET_ORGANIZATIONS_FAILED',
    CREATE_ORGANIZATION = 'CREATE_ORGANIZATION',
    CREATE_ORGANIZATION_SUCCESS = 'CREATE_ORGANIZATION_SUCCESS',
    CREATE_ORGANIZATION_FAILED = 'CREATE_ORGANIZATION_FAILED',
}

const organizationActions = {
    getOrganizations: () => createAction(OrganizationActionsTypes.GET_ORGANIZATIONS),
    getOrganizationsSuccess: (list: any[]) =>
        createAction(OrganizationActionsTypes.GET_ORGANIZATIONS_SUCCESS, { list }),
    getOrganizationsFailed: (error: any) => createAction(OrganizationActionsTypes.GET_ORGANIZATIONS_FAILED, { error }),
    createOrganization: () => createAction(OrganizationActionsTypes.CREATE_ORGANIZATION),
    createOrganizationSuccess: (organization: any) =>
        createAction(OrganizationActionsTypes.CREATE_ORGANIZATION_SUCCESS, { organization }),
    createOrganizationFailed: (slug: string, error: any) =>
        createAction(OrganizationActionsTypes.CREATE_ORGANIZATION_FAILED, { slug, error }),
};

export function getOrganizationsAsync(): ThunkAction {
    return async function (dispatch) {
        dispatch(organizationActions.getOrganizations());

        try {
            const organizations = await core.organizations.get();
            dispatch(organizationActions.getOrganizationsSuccess(organizations));
        } catch (error) {
            dispatch(organizationActions.getOrganizationsFailed(error));
        }
    };
}

export function createOrganizationAsync(
    organizationData: Store,
    onCreateSuccess?: (createdSlug: string) => void,
): ThunkAction {
    return async function (dispatch) {
        const { slug } = organizationData;
        const organization = new core.classes.Organization(organizationData);
        dispatch(organizationActions.createOrganization());

        try {
            const createdOrganization = await organization.save();
            dispatch(organizationActions.createOrganizationSuccess(createdOrganization));
            if (onCreateSuccess) onCreateSuccess(createdOrganization.slug);
        } catch (error) {
            dispatch(organizationActions.createOrganizationFailed(slug, error));
        }
    };
}

export type OrganizationActions = ActionUnion<typeof organizationActions>;