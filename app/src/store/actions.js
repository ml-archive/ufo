import TYPES from '@/store/mutation-types';
import API from '@/constants/api';
import axios from 'axios';

export default {
  // Clusters Actions
  async fetchClusters({ commit }) {
    commit(TYPES.FETCH_CLUSTERS);
    try {
      const res = await axios({
        method: 'GET',
        url: `${API.scheme}${API.url}${API.routes.clusters}`,
      });
      commit(TYPES.FETCH_CLUSTERS_SUCCESS, res.data);
    } catch (e) {
      console.log('Failed to fetch clusters');
    }
  },

  setCluster({ commit }, cluster) {
    commit(TYPES.SET_CLUSTER, cluster);
  },

  // Services Actions
  async fetchServices({ commit }, { cluster }) {
    commit(TYPES.FETCH_SERVICES);
    try {
      const res = await axios({
        method: 'GET',
        url: `${API.scheme}${API.url}${API.routes.services}?cluster=${cluster}`,
      });
      commit(TYPES.FETCH_SERVICES_SUCCESS, res.data);
    } catch (e) {
      console.log('Failed to fetch services');
    }
  },

  async fetchService({ commit }, { cluster, service }) {
    commit(TYPES.FETCH_SERVICE);
    try {
      const res = await axios({
        method: 'GET',
        url: `${API.scheme}${API.url}${API.routes.service}?cluster=${cluster}&service=${service}`,
      });
      commit(TYPES.FETCH_SERVICE_SUCCESS, res.data);
      return Promise.resolve(res.data);
    } catch (e) {
      console.log('Failed to fetch service detail');
      return e;
    }
  },

  async fetchServiceDetail({ dispatch, commit }, payload) {
    const { TaskDefinition } = await dispatch('fetchService', payload);
    commit(TYPES.FETCH_SERVICE_DETAIL);
    try {
      const res = await axios({
        method: 'GET',
        url: `${API.scheme}${API.url}${API.routes.commit}?definition=${TaskDefinition}`,
      });
      commit(TYPES.FETCH_SERVICE_DETAIL_SUCCESS, res.data);
    } catch (e) {
      console.log('Failed to fetch service commit');
    }
  },

  setService({ commit }, service) {
    commit(TYPES.SET_SERVICE, service);
  },

  // Versions Actions
  async fetchVersions({ commit }, { cluster, service }) {
    commit(TYPES.FETCH_VERSIONS);
    try {
      const res = await axios({
        method: 'GET',
        url: `${API.scheme}${API.url}${API.routes.versions}?cluster=${cluster}&service=${service}`,
      });
      commit(TYPES.FETCH_VERSIONS_SUCCESS, res.data);
    } catch (e) {
      console.log('Failed to fetch versions');
    }
  },

  setVersion({ commit }, version) {
    commit(TYPES.SET_VERSION, version);
  },

  // Deployment Actions
  async createDeployment({ commit }, { cluster, service, version }) {
    commit(TYPES.CREATE_DEPLOYMENT);
    try {
      const res = await axios({
        method: 'POST',
        url: `${API.scheme}${API.url}${API.routes.deploy}`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: { cluster, service, version },
      });
      commit(TYPES.CREATE_DEPLOYMENT_SUCCESS, res.data);
    } catch (e) {
      console.log('Failed to create deployment');
    }
  },
};