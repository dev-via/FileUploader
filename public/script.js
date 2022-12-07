// Delete confirmation modal
let forms = document.querySelectorAll('#delete-form')

for (let form of forms) {
  form.addEventListener('click', function() {
    $('#modal-btn-no').on('click', function() {
      console.log('false')
      return
    })

    $('#modal-btn-yes').on('click', function() {
      console.log('true')
      form.submit()
      return
    })
  })
}
