import { Text, Touchable, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";

interface CardProps {
  text: string;
  checked: boolean;
  onToggleCheck: () => void;
  onDelete: () => void;
  onUpdate: () => void;
}

const Card = ({
  text,
  onDelete,
  onUpdate,
  checked,
  onToggleCheck,
}: CardProps) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  return (
    <View className=" p-4 rounded-lg bg-slate-500 mt-10 mx-10 shadow flex flex-row items-center">
      <Checkbox
        value={checked}
        onValueChange={onToggleCheck}
        className=" bg-white "
      />

      <Text className="text-white text-base items-center justify-center ml-4 ">
        {text}
      </Text>
      <View className="flex-1 items-end flex-row justify-end gap-3 ">
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onUpdate}>
          <Ionicons name="pencil" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Card;
