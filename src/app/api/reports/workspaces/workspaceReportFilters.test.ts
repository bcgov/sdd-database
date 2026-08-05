import assert from "node:assert/strict";
import {buildWorkspaceReportWhereClause} from "./workspaceReportFilters";

const freeUnassigned = buildWorkspaceReportWhereClause({officeCode: "A-100", availability: "free", mode: "unassigned"});
assert.deepEqual(freeUnassigned, {AND: [{office_number: "A-100"}, {employee_id: null}, {restricted_program_area_id: null}, {is_on_hold: false}]});

const onHoldUnassigned = buildWorkspaceReportWhereClause({officeCode: "", availability: "onhold", mode: "unassigned"});
assert.deepEqual(onHoldUnassigned, {AND: [{employee_id: null}, {restricted_program_area_id: null}, {is_on_hold: true}]});

const workspaceHolds = buildWorkspaceReportWhereClause({officeCode: "A-100", availability: "onhold"});
assert.deepEqual(workspaceHolds, {AND: [{office_number: "A-100"}, {is_on_hold: true}]});

const employeeAvailabilityFilter = buildWorkspaceReportWhereClause({employeeIdPopulated: "true"});
assert.deepEqual(employeeAvailabilityFilter, {employee_id: {not: null}});

const implicitUnassignedFilter = buildWorkspaceReportWhereClause({availability: "free", mode: "unassigned"});
assert.deepEqual(implicitUnassignedFilter, {AND: [{employee_id: null}, {restricted_program_area_id: null}, {is_on_hold: false}]});

console.log("workspace report filter tests passed");
