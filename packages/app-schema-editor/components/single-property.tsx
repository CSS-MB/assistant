import React, { useState } from "react";
import { ISingleLayerProperty } from "../types";
import { UserSuggestionReason } from "../property-suggestions";
import { Divider } from "@ui/core";
import * as HoverCard from "@radix-ui/react-hover-card";
import { PropertyFieldDocuemntationHoverCard } from "./property-field-lookup-hover-card";

type UserInteractionMode = "editing" | "viewing";

const ModeToggleButton = (props: {
  current: UserInteractionMode;
  onSave: () => void;
  onStartEdit: () => void;
}) => {
  if (props.current == "viewing") {
    return <button onClick={props.onStartEdit}>edit</button>;
  }
  return <button onClick={props.onSave}>save</button>;
};

interface ISingleLayerPropertyDefinitionProps {
  initial?: ISingleLayerProperty;
  initialMode?: UserInteractionMode;
  onSave: (data: ISingleLayerProperty) => void;
  /**
   * when remove this whole preference. if not provided, remove button won't be present.
   */
  onRemove?: () => void;
  onCancel?: () => void;
  suggestions: UserSuggestionReason[];
}

export function SingleLayerPropertyDefinition(
  props: ISingleLayerPropertyDefinitionProps
) {
  const [data, setData] = useState<ISingleLayerProperty>(props.initial);

  // if no initial data provided, start with editing mode
  const _initialMode: UserInteractionMode =
    props.initialMode ?? (props.initial ? "viewing" : "editing");

  // mode state of the user interaction
  const [mode, setMode] = useState<UserInteractionMode>(_initialMode);

  const handleSave = () => {
    props.onSave(data);
    setMode("viewing");
  };

  const handleStartEdit = () => {
    setMode("editing");
  };

  const disableInputs = mode == "viewing";

  return (
    <HoverCard.Root openDelay={100} closeDelay={100}>
      <HoverCard.Trigger>
        <div style={{ margin: 16 }}>
          <Divider />
          <form>
            <input
              required
              placeholder="key name"
              defaultValue={data?.schema.name}
              onChange={(e) => {
                setData({
                  ...data,
                  schema: {
                    ...data.schema,
                    name: e.target.value,
                  },
                });
              }}
              disabled={disableInputs}
            />
            <input
              defaultValue={data?.schema.description}
              placeholder="description doc"
              onChange={(e) => {
                setData({
                  ...data,
                  schema: {
                    ...data.schema,
                    description: e.target.value,
                  },
                });
              }}
              disabled={disableInputs}
            />

            <select
              onChange={(e) => {
                setData({
                  ...data,
                  layer: {
                    ...data.layer,
                    propertyType: e.target.value as any,
                  },
                });
              }}
              disabled={disableInputs}
            >
              {props.suggestions.map((d) => {
                switch (d.type) {
                  case "suggestion":
                    return (
                      <option
                        key={d.to}
                        value={d.to}
                        selected={data?.layer?.propertyType == d.to}
                      >
                        {d.to}
                      </option>
                    );
                  default:
                    return <></>;
                }
              })}
            </select>

            {data?.layer?.propertyType && (
              <input
                required
                placeholder="type"
                defaultValue={data?.schema.type}
                onChange={(e) => {
                  setData({
                    ...data,
                    schema: {
                      ...data.schema,
                      type: e.target.value,
                    },
                  });
                }}
                disabled={disableInputs}
              />
            )}

            <ModeToggleButton
              current={mode}
              onSave={handleSave}
              onStartEdit={handleStartEdit}
            />
            {props.onRemove && <button onClick={props.onRemove}>remove</button>}
            {props.onCancel && <button onClick={props.onCancel}>cancel</button>}
          </form>
        </div>
      </HoverCard.Trigger>
      <HoverCard.Content>
        <HoverCard.Arrow />
        <PropertyFieldDocuemntationHoverCard />
      </HoverCard.Content>
    </HoverCard.Root>
  );
}
