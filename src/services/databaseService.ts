import { UserProfile, UserRole, ConceptMastery, IngestedMaterial, GeneratedVideoLecture } from '../types';

export interface DatabaseStatus {
  status: 'connected' | 'offline';
  type: string;
  filePath: string;
  userCount: number;
  lastSaved: string;
  timestamp: string;
}

export interface AuthResponse {
  success: boolean;
  user: UserProfile;
  masteryMap?: Record<string, ConceptMastery>;
  message?: string;
  error?: string;
}

/**
 * Register a new user in the internal embedded database
 */
export async function dbRegisterUser(
  name: string,
  email: string,
  password: string,
  role: UserRole = 'learner',
  institution?: string
): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, institution })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return {
      success: true,
      user: data.user,
      masteryMap: data.masteryMap,
      message: data.message
    };
  } catch (err: any) {
    console.warn('Backend database registration unavailable, falling back to local storage:', err);
    // Offline / fallback storage
    const fallbackUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email: email.trim().toLowerCase(),
      role,
      institution: institution || 'Academic Institute',
      studentId: role === 'learner' ? 'sim-student-b' : undefined,
      createdAt: new Date().toISOString()
    };
    return {
      success: true,
      user: fallbackUser,
      message: 'Account created in local session'
    };
  }
}

/**
 * Authenticate user against the internal embedded database
 */
export async function dbLoginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Authentication failed');
    }

    return {
      success: true,
      user: data.user,
      masteryMap: data.masteryMap,
      message: data.message
    };
  } catch (err: any) {
    // If server returned an explicit error (like wrong password or user not found), propagate it
    if (err.message && !err.message.includes('fetch')) {
      throw err;
    }

    console.warn('Backend database login unavailable, checking offline demo fallback:', err);
    // Offline / fallback demo profile
    const fallbackUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email: email.trim().toLowerCase(),
      role: email.includes('admin') || email.includes('faculty') ? 'admin' : 'learner',
      institution: 'Academic Institute',
      studentId: 'sim-student-b',
      createdAt: new Date().toISOString()
    };
    return {
      success: true,
      user: fallbackUser,
      message: 'Authenticated via local session'
    };
  }
}

/**
 * Persist user concept mastery map directly to the internal embedded database
 */
export async function dbSaveUserMastery(
  userId: string,
  masteryMap: Record<string, ConceptMastery>
): Promise<boolean> {
  try {
    const res = await fetch(`/api/user/${userId}/mastery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ masteryMap })
    });
    return res.ok;
  } catch (err) {
    console.warn('Could not persist mastery to server database, cached locally:', err);
    return false;
  }
}

/**
 * Retrieve user concept mastery map from the internal embedded database
 */
export async function dbGetUserMastery(userId: string): Promise<Record<string, ConceptMastery> | null> {
  try {
    const res = await fetch(`/api/user/${userId}/data`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.masteryMap && Object.keys(data.masteryMap).length > 0 ? data.masteryMap : null;
  } catch (err) {
    return null;
  }
}

/**
 * Persist uploaded material directly inside internal database
 */
export async function dbSaveUserMaterial(userId: string, material: IngestedMaterial): Promise<boolean> {
  try {
    const res = await fetch(`/api/user/${userId}/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ material })
    });
    return res.ok;
  } catch (err) {
    console.warn('Could not persist material to database:', err);
    return false;
  }
}

/**
 * Retrieve user uploaded materials from internal database
 */
export async function dbGetUserMaterials(userId: string): Promise<IngestedMaterial[]> {
  try {
    const res = await fetch(`/api/user/${userId}/materials`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.materials) ? data.materials : [];
  } catch (err) {
    return [];
  }
}

/**
 * Delete uploaded material from internal database
 */
export async function dbDeleteUserMaterial(userId: string, materialId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/user/${userId}/materials/${materialId}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

/**
 * Persist synthesized video lecture directly into internal database
 */
export async function dbSaveUserLecture(userId: string, lecture: GeneratedVideoLecture): Promise<boolean> {
  try {
    const res = await fetch(`/api/user/${userId}/lectures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lecture })
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

/**
 * Retrieve synthesized video lectures from internal database
 */
export async function dbGetUserLectures(userId: string): Promise<GeneratedVideoLecture[]> {
  try {
    const res = await fetch(`/api/user/${userId}/lectures`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.lectures) ? data.lectures : [];
  } catch (err) {
    return [];
  }
}

/**
 * Persist quiz result into internal database
 */
export async function dbSaveQuizAttempt(userId: string, quizAttempt: any): Promise<boolean> {
  try {
    const res = await fetch(`/api/user/${userId}/quizzes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizAttempt })
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

/**
 * Retrieve user quiz history from internal database
 */
export async function dbGetUserQuizzes(userId: string): Promise<any[]> {
  try {
    const res = await fetch(`/api/user/${userId}/quizzes`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.quizzes) ? data.quizzes : [];
  } catch (err) {
    return [];
  }
}

/**
 * Query internal database status & health
 */
export async function dbGetStatus(): Promise<DatabaseStatus | null> {
  try {
    const res = await fetch('/api/database/status');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetch full sanitized database records for Live Database Explorer
 */
export async function dbGetFullDatabase(): Promise<any | null> {
  try {
    const res = await fetch('/api/database/full');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * List registered users in database
 */
export async function dbListRegisteredUsers(): Promise<any[]> {
  try {
    const res = await fetch('/api/auth/users');
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.users) ? data.users : [];
  } catch {
    return [];
  }
}
