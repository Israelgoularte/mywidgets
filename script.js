(function () {
    // Função que será executada quando o widget for carregado
    return {
        // Evento acionado quando o contato for salvo ou atualizado
        onSave: function (callback) {
            // Pega o contato atual (dados do contato no card)
            var contactData = window.Kommo.getEntity();

            // Extrai o ID do contato e o campo 'PHONE_WORK'
            var contactId = contactData.id;
            var phoneWorkField = getPhoneWorkField(contactData.custom_fields);

            if (phoneWorkField) {
                // Formata os dados em JSON
                var jsonData = {
                    'contact_id': contactId,
                    'phone_id': phoneWorkField.id,
                    'phone_value': phoneWorkField.values[0].value
                };

                // Envia os dados para o webhook configurado
                sendToWebhook(jsonData);

                // Chama o callback ao terminar
                callback();
            }
        }
    };

    // Função para encontrar o campo de telefone comercial
    function getPhoneWorkField(customFields) {
        return customFields.find(field => field.code === 'PHONE_WORK');
    }

    // Função para enviar os dados formatados para o webhook
    function sendToWebhook(data) {
        var webhookUrl = AMOCRM.constant('widgets').settings.webhook_url;

        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar para o webhook');
            }
            return response.json();
        })
        .then(responseData => {
            console.log('Dados enviados com sucesso:', responseData);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }
})();
