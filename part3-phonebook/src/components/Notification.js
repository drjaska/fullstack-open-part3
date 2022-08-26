const Notification = ({message, errorStatus}) => {
  let messageColor = 'green'
  if (errorStatus === 1) {
    messageColor = 'red'
  }
  const notificationStyle = {
    color: messageColor,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification

