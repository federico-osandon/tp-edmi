<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue'
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h1>
        <p class="text-gray-500">Inicia sesión para acceder a tu panel</p>
      </div>

      <LoginForm />

      <div class="text-center text-sm text-gray-500 mt-6">
        ¿No tienes una cuenta? 
        <NuxtLink to="/register" class="text-indigo-600 hover:text-indigo-500 font-medium">Regístrate</NuxtLink>
      </div>
    </div>
  </div>
</template>
