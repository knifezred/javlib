import { $t } from '@renderer/locales'
import { BACKEND_ERROR_CODE, createFlatRequest } from '@renderer/packages/axios'
import { useAuthStore } from '@renderer/store/modules/auth'
import { getServiceBaseURL } from '@renderer/utils/service'
import { localStg } from '@renderer/utils/storage'
import { showErrorMsg } from './shared'
import type { RequestInstanceState } from './type'

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y'
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy)

export const request = createFlatRequest<App.Service.Response, RequestInstanceState>(
  {
    baseURL,
    headers: {}
  },
  {
    async onRequest(config) {
      const { headers } = config

      // set token
      const token = localStg.get('token')
      const Authorization = token ? `Bearer ${token}` : null
      Object.assign(headers, { Authorization, 'Content-Type': 'application/json' })
      return config
    },
    isBackendSuccess(response) {
      // when the backend response code is "0000"(default), it means the request is success
      // to change this logic by yourself, you can modify the `VITE_SERVICE_SUCCESS_CODE` in `.env` file
      return String(response.status) === import.meta.env.VITE_SERVICE_SUCCESS_CODE
    },
    async onBackendFail(response) {
      const authStore = useAuthStore()

      function handleLogout() {
        authStore.resetStore()
      }

      function logoutAndCleanup() {
        handleLogout()
        window.removeEventListener('beforeunload', handleLogout)

        request.state.errMsgStack = request.state.errMsgStack.filter(
          (msg) => msg !== response.data.msg
        )
      }

      // when the backend response code is in `logoutCodes`, it means the user will be logged out and redirected to login page
      const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || []
      if (logoutCodes.includes(response.data.code)) {
        handleLogout()
        return null
      }

      // when the backend response code is in `modalLogoutCodes`, it means the user will be logged out by displaying a modal
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || []
      if (
        modalLogoutCodes.includes(response.data.code) &&
        !request.state.errMsgStack?.includes(response.data.msg)
      ) {
        request.state.errMsgStack = [...(request.state.errMsgStack || []), response.data.msg]

        // prevent the user from refreshing the page
        window.addEventListener('beforeunload', handleLogout)

        window.$dialog?.error({
          title: 'Error',
          content: response.data.code,
          positiveText: $t('common.confirm'),
          maskClosable: false,
          onPositiveClick() {
            logoutAndCleanup()
          },
          onClose() {
            logoutAndCleanup()
          }
        })

        return null
      }

      return null
    },
    transformBackendResponse(response) {
      return response.data
    },
    onError(error) {
      // when the request is fail, you can show error message
      let message = error.message
      let backendErrorCode = ''

      // get backend error message and code
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.msg || message
        backendErrorCode = error.response?.data?.code || ''
      }

      // the error message is displayed in the modal
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || []
      if (modalLogoutCodes.includes(backendErrorCode)) {
        return
      }

      // when the token is expired, refresh token and retry request, so no need to show error message
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || []
      if (expiredTokenCodes.includes(backendErrorCode)) {
        return
      }

      showErrorMsg(request.state, message)
    }
  }
)
