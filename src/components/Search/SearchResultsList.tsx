import { SearchResultItem } from "@/components/Search/SearchResultItem";
import {
  AssignMode,
  Entity,
  MobileDeviceEntity,
  MobilePlanEntity,
  SelectedWorkspaceAssignment,
} from "@/types";
import { getMobileDeviceTitle } from "@/domain/mobileDevices";
import { getEmployeeFullName } from "@/domain/employees";
import { getMobilePlanTitle } from "@/domain/mobilePlans";

const getSearchResultKey = (item: Entity) => {
  // Determine a unique key based on the discriminant property
  let key: string;

  switch (item.type) {
    case "employee":
      key = `employee-${item.id}`;
      break;
    case "office":
      key = `office-${item.office_number}`;
      break;
    case "workspace":
      key = `workspace-${item.office_number}-${item.workspace_number}`;
      break;
    case "workstation":
      key = `workstation-${item.asset_tag}`;
      break;
    case "mobileDevice":
      key = `mobile-device-${item.id}`;
      break;
    case "mobilePlan":
      key = `mobile-plan-${item.id}`;
      break;
  }

  return key;
};

const getSearchResultTitle = (item: Entity) => {
  let title: string;

  switch (item.type) {
    case "employee":
      title = item.idir
        ? `${getEmployeeFullName(item)} - ${item.idir} - Office ${item.office_number}`
        : getEmployeeFullName(item);
      break;
    case "office":
      title = `${item.office_name} - ${item.office_number}`;
      break;
    case "workspace": {
      const workspaceTitleParts = [
        `Workspace ${item.workspace_number}`,
        `Office ${item.office_number}`,
        item.category.name,
        ...(item.restricted_program_area_id ? ["Protected"] : []),
        ...(item.is_on_hold ? ["On Hold"] : []),
        ...(item.position_number
          ? [`Position No ${item.position_number}`]
          : []),
      ];

      title = workspaceTitleParts.join(" - ");
      break;
    }
    case "workstation":
      title = `${item.workstation_model.name} - ${item.asset_tag}`;
      break;
    case "mobileDevice":
      title = getMobileDeviceTitle(item);
      break;
    case "mobilePlan":
      title = getMobilePlanTitle(item);
      break;
  }

  return title;
};

const getAssignClickHandler = (
  item: Entity,
  assignMode: AssignMode,
  assignOfficeClickHandler: (assignedOfficeNumber: string) => void,
  assignWorkspaceClickHandler: (
    assignedWorkspace: SelectedWorkspaceAssignment,
  ) => void,
  assignWorkstationClickHandler: (assignedWorkstationAssetTag: string) => void,
  assignMobileDeviceClickHandler: (
    assignedMobileDevice: MobileDeviceEntity,
  ) => void,
  assignMobilePlanClickHandler: (assignedMobilePlan: MobilePlanEntity) => void,
) => {
  if (item.type === "office" && assignMode === "office") {
    return () => assignOfficeClickHandler(item.office_number);
  }

  if (item.type === "workspace" && assignMode === "workspace") {
    return () =>
      assignWorkspaceClickHandler({
        workspace_number: item.workspace_number,
        restricted_program_area_id: item.restricted_program_area_id,
      });
  }

  if (item.type === "workstation" && assignMode === "workstation") {
    return () => assignWorkstationClickHandler(item.asset_tag);
  }

  if (item.type === "mobileDevice" && assignMode === "mobileDevice") {
    return () => assignMobileDeviceClickHandler(item);
  }

  if (item.type === "mobilePlan" && assignMode === "mobilePlan") {
    return () => assignMobilePlanClickHandler(item);
  }

  return undefined;
};

interface SearchResultsListProps {
  visibleSearchResults: Entity[];
  searchResultClickHandler: (item: Entity) => void;

  assignMode: AssignMode;
  assignOfficeClickHandler: (assignedOfficeNumber: string) => void;
  assignWorkspaceClickHandler: (
    assignedWorkspace: SelectedWorkspaceAssignment,
  ) => void;
  assignWorkstationClickHandler: (assignedWorkstationAssetTag: string) => void;
  assignMobileDeviceClickHandler: (
    assignedMobileDevice: MobileDeviceEntity,
  ) => void;
  assignMobilePlanClickHandler: (assignedMobilePlan: MobilePlanEntity) => void;
}

export function SearchResultsList({
  visibleSearchResults,
  searchResultClickHandler,

  assignMode,
  assignOfficeClickHandler,
  assignWorkspaceClickHandler,
  assignWorkstationClickHandler,
  assignMobileDeviceClickHandler,
  assignMobilePlanClickHandler,
}: SearchResultsListProps) {
  return (
    <>
      {visibleSearchResults.map((item) => (
        <SearchResultItem
          key={getSearchResultKey(item)}
          title={getSearchResultTitle(item)}
          searchResultClickHandler={() => searchResultClickHandler(item)}
          assignClickHandler={getAssignClickHandler(
            item,
            assignMode,
            assignOfficeClickHandler,
            assignWorkspaceClickHandler,
            assignWorkstationClickHandler,
            assignMobileDeviceClickHandler,
            assignMobilePlanClickHandler,
          )}
        ></SearchResultItem>
      ))}
    </>
  );
}
