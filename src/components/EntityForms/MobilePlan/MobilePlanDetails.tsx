import {
  Accordion,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@bcgov/design-system-react-components";
import {
  DEFAULT_MOBILE_PLAN_STATUS,
  formatMobilePlanPhoneNumber,
  MOBILE_PLAN_DATA_ALLOWANCES_GB,
  MOBILE_PLAN_STATUSES,
} from "@/domain/mobilePlans";
import { LookupOption } from "@/types";
import {
  validateMobilePlanDataAllowanceField,
  validateMobilePlanPhoneNumberField,
} from "@/validators";
import { useState } from "react";

export type MobilePlanDetailsValue = {
  phone_number: string;
  data_allowance_gb: number;
  enhanced_voicemail: boolean;
  status: LookupOption;
  service_provider: LookupOption;
};

type MobilePlanDetailsProps =
  | {
      mobilePlan: MobilePlanDetailsValue;
      isReadOnly: true;
      showStatus?: boolean;
      showEnhancedVoicemail?: boolean;
    }
  | {
      statuses: LookupOption[];
      serviceProviders: LookupOption[];
      isReadOnly: false;
    };

export function MobilePlanDetails(props: MobilePlanDetailsProps) {
  return (
    <Accordion label="Mobile Plan Details" id="mobilePlanDetails">
      <div style={{ width: "100%" }}>
        {props.isReadOnly ? (
          <ReadOnlyMobilePlanFields
            mobilePlan={props.mobilePlan}
            showStatus={props.showStatus ?? true}
            showEnhancedVoicemail={props.showEnhancedVoicemail ?? true}
          />
        ) : (
          <CreateMobilePlanFields
            statuses={props.statuses}
            serviceProviders={props.serviceProviders}
          />
        )}
      </div>
    </Accordion>
  );
}

function ReadOnlyMobilePlanFields({
  mobilePlan,
  showStatus,
  showEnhancedVoicemail,
}: {
  mobilePlan: MobilePlanDetailsValue;
  showStatus: boolean;
  showEnhancedVoicemail: boolean;
}) {
  const statusOptions = MOBILE_PLAN_STATUSES.includes(
    mobilePlan.status.name as (typeof MOBILE_PLAN_STATUSES)[number],
  )
    ? MOBILE_PLAN_STATUSES
    : [...MOBILE_PLAN_STATUSES, mobilePlan.status.name];

  return (
    <>
      <TextField
        label="Phone Number"
        isReadOnly
        defaultValue={formatMobilePlanPhoneNumber(mobilePlan.phone_number)}
      ></TextField>

      <Select
        label="Service Provider"
        items={[
          {
            id: mobilePlan.service_provider.id,
            label: mobilePlan.service_provider.name,
          },
        ]}
        isDisabled
        selectedKey={mobilePlan.service_provider.id}
      ></Select>

      <RadioGroup
        label="Data Allowance"
        value={String(mobilePlan.data_allowance_gb)}
        isReadOnly
        orientation="vertical"
        style={{
          width: "fit-content",
          marginTop: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        {MOBILE_PLAN_DATA_ALLOWANCES_GB.map((allowanceGb) => (
          <Radio key={allowanceGb} value={String(allowanceGb)}>
            {allowanceGb} GB
          </Radio>
        ))}
      </RadioGroup>

      {showEnhancedVoicemail && (
        <div
          style={{
            marginTop: "1rem",
            marginBottom: "1rem",
            padding: "0.75rem 1rem",
            border: "1px solid #d8d8d8",
            borderRadius: "4px",
            width: "fit-content",
          }}
        >
          <Switch
            labelPosition="left"
            isSelected={mobilePlan.enhanced_voicemail}
            isReadOnly
          >
            Enhanced Voicemail
          </Switch>
        </div>
      )}

      {showStatus && (
        <div style={{ width: "fit-content", marginBottom: "0.5rem" }}>
          <ToggleButtonGroup
            label="Status"
            aria-label="Status"
            isDisabled
            disallowEmptySelection
            selectedKeys={[mobilePlan.status.name]}
            style={{ width: "fit-content" }}
          >
            {statusOptions.map((status) => (
              <ToggleButton key={status} id={status}>
                {status}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
      )}
    </>
  );
}

function CreateMobilePlanFields({
  statuses,
  serviceProviders,
}: {
  statuses: LookupOption[];
  serviceProviders: LookupOption[];
}) {
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [enhancedVoicemail, setEnhancedVoicemail] = useState(false);

  const defaultStatusId =
    statuses.find((status) => status.name === DEFAULT_MOBILE_PLAN_STATUS)?.id ??
    null;

  const currentStatusId = selectedStatusId ?? defaultStatusId;

  return (
    <>
      <TextField
        label="Phone Number"
        name="phoneNumber"
        isRequired
        inputMode="numeric"
        maxLength={10}
        description="Enter the 10-digit phone number without spaces or hyphens"
        validate={validateMobilePlanPhoneNumberField}
      ></TextField>

      <Select
        label="Service Provider"
        name="serviceProvider"
        isRequired
        items={serviceProviders.map((serviceProvider) => ({
          id: serviceProvider.id,
          label: serviceProvider.name,
        }))}
      ></Select>

      <RadioGroup
        label="Data Allowance"
        name="dataAllowanceGb"
        isRequired
        orientation="vertical"
        validate={validateMobilePlanDataAllowanceField}
        style={{
          width: "fit-content",
          marginTop: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        {MOBILE_PLAN_DATA_ALLOWANCES_GB.map((allowanceGb) => (
          <Radio key={allowanceGb} value={String(allowanceGb)}>
            {allowanceGb} GB
          </Radio>
        ))}
      </RadioGroup>

      <div
        style={{
          marginTop: "1rem",
          marginBottom: "1rem",
          padding: "0.75rem 1rem",
          border: "1px solid #d8d8d8",
          borderRadius: "4px",
          width: "fit-content",
        }}
      >
        <Switch
          name="enhancedVoicemail"
          labelPosition="left"
          isSelected={enhancedVoicemail}
          onChange={setEnhancedVoicemail}
        >
          Enhanced Voicemail
        </Switch>
      </div>

      <div style={{ width: "fit-content", marginBottom: "0.5rem" }}>
        <ToggleButtonGroup
          label="Status (required)"
          aria-label="Status (required)"
          disallowEmptySelection
          selectedKeys={currentStatusId === null ? [] : [currentStatusId]}
          onSelectionChange={(selectedKeys) => {
            const [statusId] = selectedKeys;

            setSelectedStatusId(
              statusId === undefined ? null : Number(statusId),
            );
          }}
          style={{ width: "fit-content" }}
        >
          {statuses.map((status) => (
            <ToggleButton key={status.id} id={status.id}>
              {status.name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>

      <input type="hidden" name="status" value={currentStatusId ?? ""} />
    </>
  );
}
