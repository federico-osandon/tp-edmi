<script setup lang="ts">
import RegisterForm from '~/components/auth/RegisterForm.vue'
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
        <p class="text-gray-500">Únete como estudiante o instructor</p>
      </div>

      <RegisterForm />

      <div class="text-center text-sm text-gray-500 mt-6">
        ¿Ya tienes una cuenta? 
        <NuxtLink to="/login" class="text-indigo-600 hover:text-indigo-500 font-medium">Inicia Sesión</NuxtLink>
      </div>
    </div>
  </div>
</template>
