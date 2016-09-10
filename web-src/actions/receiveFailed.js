export const RECEIVE_FAILED = 'RECEIVE_FAILED'
export function receiveFailed (error) {
  return {
    type: RECEIVE_FAILED,
    receiveAt: Date.now(),
    error: error
  }
}
