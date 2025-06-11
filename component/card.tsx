import { Text, Touchable, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";

interface CardProps {
  text: string;
  onDelete: () => void;
}

const Card = ({ text, onDelete }: CardProps) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  return (
    <View className=" p-3 rounded-lg bg-slate-500 mt-10 mx-10 shadow flex flex-row items-center">
      <Checkbox
        value={toggleCheckBox}
        onValueChange={(newValue) => setToggleCheckBox(newValue)}
        className=" bg-white "
      />

      <Text className="text-white items-center justify-center ml-5 ">
        {text}
      </Text>
      <View className="flex-1 items-end ">
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Card;
