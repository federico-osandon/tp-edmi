export const useSupabase = () => {
    // Helper to get data from localStorage
    const getStorage = (key: string) => {
        if (import.meta.client) {
            const data = localStorage.getItem(key)
            return data ? JSON.parse(data) : []
        }
        return []
    }

    // Helper to set data to localStorage
    const setStorage = (key: string, data: any) => {
        if (import.meta.client) {
            localStorage.setItem(key, JSON.stringify(data))
        }
    }

    // Mock Auth
    const auth = {
        signUp: async ({ email, password, options }: any) => {
            const users = getStorage('supabase_users')
            if (users.find((u: any) => u.email === email)) {
                return { error: { message: 'User already exists' }, data: null }
            }
            const newUser = {
                id: crypto.randomUUID(),
                email,
                password, // In a real app, never store plain passwords!
                role: options?.data?.role || 'student',
                created_at: new Date().toISOString(),
            }
            users.push(newUser)
            setStorage('supabase_users', users)
            return { data: { user: newUser }, error: null }
        },
        signInWithPassword: async ({ email, password }: any) => {
            const users = getStorage('supabase_users')
            const user = users.find((u: any) => u.email === email && u.password === password)
            if (!user) {
                return { error: { message: 'Invalid credentials' }, data: null }
            }
            // Simulate session
            if (import.meta.client) {
                localStorage.setItem('supabase_session', JSON.stringify(user))
            }
            return { data: { user }, error: null }
        },
        signOut: async () => {
            if (import.meta.client) {
                localStorage.removeItem('supabase_session')
            }
            return { error: null }
        },
        getUser: async () => {
            if (import.meta.client) {
                const user = localStorage.getItem('supabase_session')
                return { data: { user: user ? JSON.parse(user) : null }, error: null }
            }
            return { data: { user: null }, error: null }
        },
    }

    // Mock DB
    const from = (table: string) => {
        return {
            select: async () => {
                const data = getStorage(`supabase_${table}`)
                return { data, error: null }
            },
            insert: async (row: any) => {
                const data = getStorage(`supabase_${table}`)
                const newRow = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...row }
                data.push(newRow)
                setStorage(`supabase_${table}`, data)
                return { data: [newRow], error: null }
            },
            delete: () => {
                return {
                    eq: async (column: string, value: any) => {
                        const data = getStorage(`supabase_${table}`)
                        const newData = data.filter((row: any) => row[column] !== value)
                        setStorage(`supabase_${table}`, newData)
                        return { error: null }
                    }
                }
            },
            // Simple update mock if needed, can be expanded
            update: (updates: any) => {
                return {
                    eq: async (column: string, value: any) => {
                        const data = getStorage(`supabase_${table}`)
                        const index = data.findIndex((row: any) => row[column] === value)
                        if (index !== -1) {
                            data[index] = { ...data[index], ...updates }
                            setStorage(`supabase_${table}`, data)
                        }
                        return { error: null }
                    }
                }
            }
        }
    }

    // Mock Storage
    const storage = {
        from: (bucket: string) => ({
            upload: async (path: string, file: File) => {
                // In a real mock we might store base64, but here we'll just pretend
                // and return a fake path.
                console.log(`[Mock Storage] Uploaded ${file.name} to ${bucket}/${path}`)
                return { data: { path }, error: null }
            },
            getPublicUrl: (path: string) => {
                return { data: { publicUrl: `https://fake-supabase.com/storage/v1/object/public/${bucket}/${path}` } }
            }
        })
    }

    return { auth, from, storage }
}
