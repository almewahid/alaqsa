import { supabase } from '@/lib/supabase'

/**
 * جلب مادة بالاسم
 */
export async function getSubjectByName(subjectName: string) {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('id, name_ar, name_en, code')
      .or(`name_ar.ilike.%${subjectName}%,name_en.ilike.%${subjectName}%`)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching subject:', error)
    return null
  }
}

/**
 * جلب جميع المواد
 */
export async function getAllSubjects() {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('id, name_ar, name_en, code')
      .order('name_ar')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return []
  }
}

/**
 * جلب مادة بالـ ID
 */
export async function getSubjectById(subjectId: string) {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', subjectId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching subject by ID:', error)
    return null
  }
}
