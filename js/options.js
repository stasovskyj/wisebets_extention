
const initOptions = () => {

    chrome.storage.sync.get().then((config) => {
        if (typeof config.apiKey !== 'undefined') {
            $("#api-key").val(config.apiKey);
            $("#scapegoat-id").val(config.scapegoatId);
            $("#api-key").prop('disabled', true);
            $("#scapegoat-id").prop('disabled', true);
            console.log("Опції завантажено")
            console.log(config.accounts);
        } else {
            console.log("Відсутні опції");
            $('#save').removeClass('d-none');
        }
    });
}

const saveOptions = () => {

    let apiKey = $("#api-key").val();
    let scapegoatId = $("#scapegoat-id").val();

    if (apiKey.length == 64) {

        $.ajax({
            method: 'GET',
            url: "https://forkmaster.pp.ua/api/scapegoat/accounts/",
            data: { "api-key": apiKey, "scapegoat-id": scapegoatId },
            dataType: 'json',
            beforeSend: function () {
                $('#status').html('');
                $('#status').addClass('d-none');

            },
            success: function (response) {

                if (response.errors && response.errors.length > 0) {

                    $('#status').html(response.errors[0]);
                    $('#status').removeClass('d-none');
                    $('#status').toggleClass("alert-danger", "alert-success")
                    $('#status').fadeOut(5000);

                } else {

                    chrome.storage.sync.set(
                        { apiKey: apiKey, scapegoatId: scapegoatId, accounts: response.accounts },
                        () => {
                            if (chrome.runtime.lastError) {
                                $('#status').removeClass('d-none');
                                $('#status').toggleClass("alert-danger", "alert-success")
                                $('#status').html(chrome.runtime.lastError);

                            } else {

                                $('#status').html('Збережено');
                                $('#status').toggleClass("alert-success", "alert-danger")
                                $('#status').removeClass('d-none');
                                $('#status').fadeOut(3000);

                                $("#api-key").prop('disabled', true);
                                $("#scapegoat-id").prop('disabled', true);
                                $("#save").addClass("d-none");
                            }

                        }
                    );
                }

            }

        })
    } else {
        $('#status').toggleClass("alert-danger", "alert-success")
        $('#status').html('Це не ключ API');
        $('#status').removeClass('d-none');
    }
}
//bind events to dom elements
document.addEventListener('DOMContentLoaded', initOptions);
document.getElementById('save').addEventListener('click', saveOptions);