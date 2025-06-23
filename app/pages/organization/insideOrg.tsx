import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, ScrollView, SafeAreaView,
  StatusBar, Platform, TextInput, Switch, Modal, Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import AppLoading from "expo-app-loading";
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TaskInput from "../../../component/TaskInput";
import TaskList from "../../../component/TaskList";

const tabs = ["Tasks", "Members", "Settings"];
const API_BASE = process.env.EXPO_PUBLIC_API_URL;

interface Task {
  id: number;
  title: string;
  checked: boolean;
  assigneeName?: string | null;
}

export default function OrganizationScreen() {
  const [activeTab, setActiveTab] = useState("Tasks");
  const navigation = useNavigation();

  const params = useLocalSearchParams();
  const orgDataRaw = params.orgData as string | undefined;
  const userRole = (params.userRole as "admin" | "member") || "member";

  const [task, setTask] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [members, setMembers] = useState<{ id: string; name: string }[]>([]);
  const [orgTasks, setOrgTasks] = useState<Task[]>([]);
  const [editOrgTask, setEditOrgTask] = useState<Task | null>(null);

  let orgData;
  try {
    orgData = orgDataRaw ? JSON.parse(orgDataRaw) : null;
  } catch (e) {
    console.error("Invalid orgData JSON:", e);
    orgData = null;
  }
  const fetchOrgTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/organizations/${orgData.orgId}/tasks`);
      const data = await res.json();
      setOrgTasks(
        data.map((t: any) => ({
          id: t.task_id,
          title: t.task_title,
          checked: t.task_status?.trim().toLowerCase() === "done",
          assigneeName: t.assignee_name || null,
        }))
      );

    } catch (err) {
      console.error("Failed to fetch org tasks", err);
    }
  };

  useEffect(() => {
    if (!orgData?.orgId) return;
    fetchOrgTasks();
  }, [orgData?.orgId]);

  useEffect(() => {
    if (!orgData?.orgId) return;

    const fetchMembers = async () => {
      try {
        const res = await fetch(`${API_BASE}/organizations/${orgData.orgId}/members`);
        const data = await res.json();
        const formatted = data.map((m: any) => ({ id: String(m.user_id), name: m.name }));
        setMembers(formatted);
      } catch (err) {
        console.error("Failed to load members", err);
      }
    };

    fetchMembers();
  }, [orgData?.orgId]);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const deleteOrgTask = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/delete-task/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setOrgTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.error("Failed to delete org task", e);
    }
  };

  const startEditOrgTask = (task: Task) => {
    setTask(task.title);
    setEditOrgTask(task);
    const matched = members.find((m) => m.name === task.assigneeName);
    setAssigneeId(matched?.id || "");
  };

  const toggleOrgCheck = async (id: number) => {
    const task = orgTasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus = task.checked ? "todo" : "done";

    try {
      const res = await fetch(`${API_BASE}/update-task-status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update task status");

      setOrgTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t))
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleAddTask = async () => {
    if (!task.trim()) return;

    try {
      if (editOrgTask) {
        const res = await fetch(`${API_BASE}/update-task-org/${editOrgTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: task, assigneeId: assigneeId || null, orgId: orgData.orgId }),
        });

        if (!res.ok) throw new Error("Failed to update org task");

        const updated = await res.json(); // get updated task with assignee name

        setOrgTasks((prev) =>
          prev.map((t) =>
            t.id === editOrgTask.id
              ? {
                ...t,
                title: updated.task_title,
                assigneeName: updated.assignee_name || null,
              }
              : t
          )
        );

        setEditOrgTask(null);
      }
      else {
        const res = await fetch(`${API_BASE}/org-tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            org_id: orgData.orgId,
            title: task,
            creator_id: await AsyncStorage.getItem("user_id"),
            assignee_id: assigneeId || null,
          }),
        });

        const data = await res.json();
        await fetchOrgTasks();
      }

      setTask("");
      setAssigneeId("");
    } catch (error) {
      console.error("Add task error", error);
    }
  };

  const [formData, setFormData] = useState({
    orgName: orgData?.orgName || "",
    orgCode: orgData?.orgCode || "",
    body: orgData?.body || "",
    visibility: orgData?.visibility || "public",
    isBusiness: orgData?.isBusiness || false,
  });

  if (!fontsLoaded) return <AppLoading />;

  if (!orgData) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text style={{ fontFamily: "Poppins_400Regular" }} className="text-gray-500">
          No organization data provided.
        </Text>
      </SafeAreaView>
    );
  }

  const renderTabContent = () => {
    if (activeTab === "Tasks") {
      return (
        <View>
          <TaskInput
            text={task}
            onChange={setTask}
            onAdd={handleAddTask}
            showAssigneePicker={true}
            assigneeId={assigneeId}
            onAssigneeChange={setAssigneeId}
            members={members}
          />
          <TaskList
            tasks={orgTasks}
            onDelete={deleteOrgTask}
            onUpdate={startEditOrgTask}
            onToggleCheck={toggleOrgCheck}
            type="organization"
          />
        </View>
      );
    }

    if (activeTab === "Members") {
      return (
        <Text className="text-center text-gray-600" style={{ fontFamily: "Poppins_400Regular" }}>
          Members list will show here.
        </Text>
      );
    }

    if (activeTab === "Settings" && userRole === "admin") {
      return (
        <View className="space-y-4">
          <Text style={{ fontFamily: "Poppins_500Medium" }}>Organization Name</Text>
          <TextInput
            className="border border-gray-300 rounded-full px-4 py-2"
            style={{ fontFamily: "Poppins_400Regular" }}
            value={formData.orgName}
            onChangeText={(text) => setFormData({ ...formData, orgName: text })}
          />

          <Text style={{ fontFamily: "Poppins_500Medium" }}>Organization Code</Text>
          <TextInput
            className="border border-gray-300 rounded-full px-4 py-2"
            style={{ fontFamily: "Poppins_400Regular" }}
            value={formData.orgCode}
            onChangeText={(text) => setFormData({ ...formData, orgCode: text })}
          />

          <Text style={{ fontFamily: "Poppins_500Medium" }}>Description</Text>
          <TextInput
            multiline
            numberOfLines={4}
            className="border border-gray-300 rounded-2xl px-4 py-2"
            style={{ fontFamily: "Poppins_400Regular", textAlignVertical: "top" }}
            value={formData.body}
            onChangeText={(text) => setFormData({ ...formData, body: text })}
          />

          <View className="flex-row justify-between items-center">
            <Text style={{ fontFamily: "Poppins_500Medium" }}>Private Organization</Text>
            <Switch
              trackColor={{ false: "#ccc", true: "#F96E2A" }}
              thumbColor={formData.visibility === "private" ? "#fff" : "#fff"}
              value={formData.visibility === "private"}
              onValueChange={(val) =>
                setFormData({ ...formData, visibility: val ? "private" : "public" })
              }
            />
          </View>

          <View className="flex-row justify-between items-center">
            <Text style={{ fontFamily: "Poppins_500Medium" }}>Is this a Business?</Text>
            <Switch
              trackColor={{ false: "#ccc", true: "#F96E2A" }}
              thumbColor={formData.isBusiness ? "#fff" : "#fff"}
              value={formData.isBusiness}
              onValueChange={(val) => setFormData({ ...formData, isBusiness: val })}
            />
          </View>

          <TouchableOpacity
            onPress={() => console.log("Save settings", formData)}
            className="mt-4 bg-[#213555] rounded-full p-3"
          >
            <Text className="text-white text-center" style={{ fontFamily: "Poppins_700Bold" }}>
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="px-4 py-3">
          <Text style={{ color: "#213555", fontFamily: "Poppins_500Medium" }}>← Back</Text>
        </TouchableOpacity>

        <View className="bg-[#213555] py-6 px-4 rounded-b-3xl items-center">
          {orgData.logoUrl ? (
            <Image source={{ uri: orgData.logoUrl }} style={{ width: 60, height: 60, borderRadius: 30 }} />
          ) : (
            <View className="bg-white rounded-full w-12 h-12 justify-center items-center">
              <Text className="text-[#213555] text-xl" style={{ fontFamily: "Poppins_700Bold" }}>
                {orgData.orgName?.[0] || "O"}
              </Text>
            </View>
          )}

          <Text className="text-white text-2xl mt-2" style={{ fontFamily: "Poppins_700Bold" }}>
            {orgData.orgName}
          </Text>
          {orgData.description && (
            <Text className="text-white text-sm mt-1" style={{ fontFamily: "Poppins_400Regular" }}>
              {orgData.description}
            </Text>
          )}
        </View>

        <View className="flex-row justify-around mt-4 border-b border-gray-200 pb-2">
          {tabs.map((tab) => {
            if (tab === "Settings" && userRole !== "admin") return null;

            return (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                <Text
                  className={`${activeTab === tab ? "text-[#213555]" : "text-gray-500"}`}
                  style={{
                    fontFamily: activeTab === tab ? "Poppins_700Bold" : "Poppins_500Medium",
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="px-4 pt-4 pb-10">{renderTabContent()}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
