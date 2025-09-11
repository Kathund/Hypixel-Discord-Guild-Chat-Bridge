let changed = false;
const originalValues = new Map();

function update() {
  const saveChanges = document.getElementById('saveChanges');
  if (!saveChanges) return;
  if (changed) {
    saveChanges.classList.remove('translate-y-16');
  } else {
    saveChanges.classList.add('translate-y-16');
  }
}

function getValue(element) {
  return element.type === 'checkbox' ? element.checked : element.value;
}

document.addEventListener('DOMContentLoaded', () => {
  fetch(`/force/save`, { method: 'POST' });
  fetch('/data/discord/server');

  document.querySelectorAll('input, select').forEach(async (input) => {
    originalValues.set(input.id, getValue(input));
    if (input.dataset.optionType === 'number') {
      input.addEventListener('input', () => {
        input.value = input.value.replace(/[^0-9]/g, '');
      });
    }

    if (input.dataset.optionType === 'stringSelect') {
      if (input.dataset.prefill !== undefined) {
        try {
          const response = await fetch(`/data/discord/server`);
          const data = await response.json();
          if (!data.success) return alert(data.message);
          const setId = input.dataset.value;
          switch (input.dataset.prefill) {
            case 'prefill_roles': {
              data.data.roles
                .filter((role) => role.bot !== true)
                .forEach((role) => {
                  input.appendChild(
                    Object.assign(document.createElement('option'), {
                      value: role.id,
                      textContent: role.name,
                      disabled: role.bot,
                      selected: role.id === setId
                    })
                  );
                });
              break;
            }
            case 'prefill_channels': {
              data.data.channels
                .filter((channel) => ![1, 2, 3, 4, 5, 10, 13, 14, 15, 16].includes(channel.type))
                .forEach((channel) => {
                  input.appendChild(
                    Object.assign(document.createElement('option'), {
                      value: channel.id,
                      textContent: channel.name,
                      selected: channel.id === setId
                    })
                  );
                });
              break;
            }
            case 'prefill_members': {
              data.data.members
                .filter((member) => member.bot !== true)
                .forEach((member) => {
                  input.appendChild(
                    Object.assign(document.createElement('option'), {
                      value: member.id,
                      textContent: `@${member.username}`,
                      selected: member.id === setId
                    })
                  );
                });
              break;
            }
            default: {
            }
          }
        } catch (error) {
          console.log(error);
        }
      }

      const tomSelectSettings = {
        plugins: ['dropdown_input'],
        maxOptions: null,
        allowEmptyOption: false,
        onBlur() {
          if (!this.getValue() && input.dataset.allowEmpty !== 'true') this.setValue(input.dataset.defaultValue, true);
        }
      };

      if (input.dataset.allowEmpty === 'true') tomSelectSettings.plugins.push('clear_button');
      new TomSelect(input, tomSelectSettings);
    } else if (input.dataset.optionType === 'array') {
      new TomSelect(input, {
        plugins: ['remove_button', 'clear_button'],
        persist: false,
        createOnBlur: true,
        create: true,
        openOnFocus: false
      });
    }

    input.addEventListener('change', () => {
      if (input.dataset.optionType === 'number') {
        if (input.min !== undefined && Number(input.min) > Number(getValue(document.getElementById(input.id)))) {
          input.value = input.min;
        }
        if (input.max !== undefined && Number(input.max) < Number(getValue(document.getElementById(input.id)))) {
          input.value = input.max;
        }
      }

      changed = Array.from(originalValues.entries()).some(([id, originalValue]) => {
        return getValue(document.getElementById(id)) !== originalValue;
      });

      update();
    });
  });

  document.getElementById('saveData').addEventListener('click', async () => {
    const data = {};
    document.querySelectorAll('input, select').forEach((input) => {
      data[input.id] = getValue(input);
      if (input.dataset.optionType === 'number') {
        data[input.id] = Number(data[input.id]);
      }
    });

    const response = await fetch(`${window.location.pathname}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) window.location.reload();
  });

  document.getElementById('deleteData').addEventListener('click', () => {
    window.location.reload();
  });

  const reloadButton = document.getElementById('internal_button_reload_commands');
  if (reloadButton) {
    reloadButton.addEventListener('click', async () => {
      const response = await fetch(`/data/discord/reload/commands`, { method: 'POST' });
      const result = await response.json();
      if (result.success) window.location.reload();
    });
  }

  document.getElementById('internal_button_export_config').addEventListener('click', async () => {
    const response = await fetch(`/data/config/export`);
    const result = await response.json();
    if (result.success) {
      navigator.clipboard
        .writeText(result.data)
        .then(() => {
          alert('Exported Data copied to clipboard');
        })
        .catch((error) => {
          console.error(error);
          alert('Failed to copy data to clipboard');
        });
    }
  });

  document.getElementById('internal_button_import_config').addEventListener('click', async () => {
    const base64 = prompt('Exported Config Data');
    const response = await fetch('/data/config/import', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: base64
    });
    const result = await response.json();
    if (result.success) return alert('Please restart the bot for the changes to apply');
    return alert(result.message);
  });

  document.getElementById('reload-guild-data').addEventListener('click', async () => {
    const response = await fetch(`/data/discord/server?bypass=true`);
    const result = await response.json();
    if (result.success) window.location.reload();
  });

  update();
});
