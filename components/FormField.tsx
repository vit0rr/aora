import {
  View,
  Text,
  TextInput,
  type KeyboardTypeOptions,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

import { icons } from "../constants";

type FormFieldsProps = {
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (e: string) => void;
  otherStyles?: string;
  keyboardType?: KeyboardTypeOptions;
};
const FormField = ({
  handleChangeText,
  placeholder,
  title,
  value,
  otherStyles,
  keyboardType,
}: FormFieldsProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="border-2 border-black-200 w-full px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
        <TextInput
          className="flex-1 text-white font-psemibold text-base min-h-[48px]"
          style={{ width: "100%" }}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={"#7B7B8B"}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          keyboardType={keyboardType}
          editable
          autoCapitalize="none"
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
