import api from './api';

export interface AdminUser {
  _id: string;
  id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  telegramChatId?: string;
  telegramUsername?: string;
  roles?: string[];
  isActive?: boolean;
  userId?: string;
  systemId?: string;
}

export const getUsers = async (): Promise<AdminUser[]> => {
  const res = await api.get('/api/users');
  return res.data.users || [];
};

export const getUser = async (id: string): Promise<AdminUser | null> => {
  const res = await api.get(`/api/users/${encodeURIComponent(id)}`);
  return res.data.user || null;
};

export const updateUser = async (id: string, data: Partial<AdminUser>) => {
  console.log('🔄 Updating user:', id);
  console.log('📤 Update data:', data);
  
  try {
    const res = await api.put(`/api/users/${id}`, data);
    console.log('✅ User update response:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('❌ User update failed:', error);
    console.error('Request details:', {
      url: `/api/users/${id}`,
      method: 'PUT',
      data: data
    });
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  console.log('🔄 Deleting user:', id);
  
  try {
    const res = await api.delete(`/api/users/${id}`);
    console.log('✅ User delete response:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('❌ User delete failed:', error);
    console.error('Request details:', {
      url: `/api/users/${id}`,
      method: 'DELETE'
    });
    throw error;
  }
};

export const resetPassword = async (id: string) => {
  console.log('🔄 Resetting password for user:', id);
  
  try {
    const res = await api.post(`/api/users/${id}/reset-password`);
    console.log('✅ Password reset response:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('❌ Password reset failed:', error);
    console.error('Request details:', {
      url: `/api/users/${id}/reset-password`,
      method: 'POST'
    });
    throw error;
  }
};

export const createUser = async (userData: any) => {
  console.log('🔄 Sending user creation request to:', '/api/users/register');
  console.log('📤 User data:', userData);
  
  try {
    const res = await api.post('/api/users/register', userData);
    console.log('✅ API response:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('❌ API request failed:', error);
    console.error('Request details:', {
      url: '/api/users/register',
      method: 'POST',
      data: userData
    });
    throw error;
  }
};

const usersService = {
  getUsers,
  updateUser,
  deleteUser,
  resetPassword,
  getUser,
  createUser,
};
export default usersService;
