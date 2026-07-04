/**
 * dataLoader.js - 数据加载工具
 * 从本地 assets/data/ 加载 JSON 数据
 */

// 本地 JSON 数据（小程序中 require 可直接加载 JSON）
let tracksData = null;
let modelsData = null;
let agentRolesData = null;

try {
  tracksData = require("../assets/data/tracks.json");
} catch (e) {
  tracksData = {};
}
try {
  modelsData = require("../assets/data/models.json");
} catch (e) {
  modelsData = {};
}
try {
  agentRolesData = require("../assets/data/agent-roles.json");
} catch (e) {
  agentRolesData = { roles: [], categories: [] };
}

// 加载学习路线数据
function loadTracks() {
  return Promise.resolve(tracksData);
}

// 加载模型数据
function loadModels() {
  let data = modelsData;
  if (Array.isArray(data)) return Promise.resolve(data);
  if (data.models) return Promise.resolve(data.models);
  return Promise.resolve(data);
}

// 加载 Agent 角色卡数据
function loadAgentRoles() {
  if (agentRolesData.roles) return Promise.resolve(agentRolesData);
  if (Array.isArray(agentRolesData)) return Promise.resolve({ roles: agentRolesData, categories: [] });
  return Promise.resolve(agentRolesData);
}

// 加载资源雷达数据（预留）
function loadResources() {
  try {
    const data = require("../assets/data/resources.json");
    return Promise.resolve(data);
  } catch (e) {
    return Promise.resolve([]);
  }
}

module.exports = {
  loadTracks,
  loadModels,
  loadAgentRoles,
  loadResources,
};
