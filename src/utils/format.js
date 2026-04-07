export function formatCurrency(value) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

export function formatTime(value) {
  if (!value) {
    return '시간 미입력'
  }

  const [hour = '00', minute = '00'] = String(value).split(':')
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
}
