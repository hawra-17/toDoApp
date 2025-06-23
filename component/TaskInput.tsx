import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

interface TaskInputProps {
  text: string;
  onChange: (text: string) => void;
  onAdd: () => void;
  // ------- anything below is related to Orgs -------
  showAssigneePicker?: boolean;
  assigneeId?: string;
  onAssigneeChange?: (userId: string) => void;
  members?: { id: string; name: string }[]; // for org tasks
  // ------- end -------------------------------------
}

const TaskInput = ({
  text, onChange, onAdd
  // ---- Related to Org ----
  , showAssigneePicker = false,
  assigneeId,
  onAssigneeChange,
  members = [],
  // ---------end-------------
}: TaskInputProps) => {
  return (
    <View className="px-4 py-3 border-t border-gray-200 bg-white space-y-2">
      {/* Input field */}
      <View className="flex-row items-center">
        <TextInput
          className="border-2 rounded-3xl px-5 py-3 flex-1 mr-3"
          placeholder="Enter the task"
          value={text}
          onChangeText={onChange}
          style={{
            fontFamily: "Poppins_400Regular",
          }}
        />
        <TouchableOpacity onPress={onAdd}>
          <Ionicons name="add-circle" size={40} color="#213555" />
        </TouchableOpacity>
      </View>

      {showAssigneePicker && (
        <View className="mt-4 flex-row justify-center items-center space-x-2">
          {/* Icon */}
          <Ionicons
            name="person-outline"
            size={14}
            color="gray"
            style={{ marginRight: 6 }}
          />

          {/* Selected name or placeholder */}
          <Text
            className="text-gray-700 text-xs"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            {assigneeId
              ? members.find((m) => m.id === assigneeId)?.name
              : "Assign to..."}
          </Text>

          <Picker
            selectedValue={assigneeId}
            onValueChange={onAssigneeChange}
            dropdownIconColor="gray"
            mode="dropdown"
            style={{
              flex: 1,
              fontSize: 12,
              height: 28,
              fontFamily: "Poppins_500Medium",
              width: 100,
            }}
          >
            <Picker.Item label="Assign to..." value="" />
            {members.map((m) => (
              <Picker.Item key={m.id} label={m.name} value={m.id} />
            ))}
          </Picker>
        </View>
      )}

    </View>
  );
};

export default TaskInput;
