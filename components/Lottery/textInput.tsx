import React, { memo } from "react";
import { TextInput } from "react-native-paper";
import __ from "lodash";

interface IInput {
  value: string;
  onChangeText: (text: string) => void;
  defaultValue?: string;
  placeholder: string;
  baseDetection: any;
  length: number;
  affixType: string;
}

// Memoized TextInput component
const MemoizedTextInput = memo(
  ({
    placeholder,
    value,
    onChangeText,
    defaultValue,
    baseDetection,
    length,
    affixType,
  }: IInput) => {
    return (
      <TextInput
        placeholder={placeholder}
        style={{ backgroundColor: "white" }}
        defaultValue={__.isUndefined(defaultValue) ? "" : defaultValue}
        // value={value}
        maxLength={length}
        keyboardType={baseDetection}
        onChangeText={onChangeText}
        right={affixType == "yes" ? <TextInput.Affix text="HTG" /> : ""}
      />
    );
  }
);

export default MemoizedTextInput;