// Форматируем дату
export function formattedTime(time: string) {
  if (time.length == 0) return ''
  const date = new Date(time)
  return date.toLocaleDateString('en-EN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}