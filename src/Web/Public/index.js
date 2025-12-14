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

document.addEventListener('DOMContentLoaded', async () => {
  fetch('/force/save', { method: 'POST' });
  await fetch('/data/discord/server');

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
          const response = await fetch('/data/discord/server');
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
                .filter((channel) => ![1, 3, 4, 5, 10, 13, 14, 15, 16].includes(channel.type))
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
          console.error(error);
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
    } else if (input.dataset.optionType === 'internal') {
      if (input.dataset.internalType === 'string') {
        input.readOnly = true;
      }
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

  const discordReloadButton = document.getElementById('internal_button_reload_commands_discord');
  if (discordReloadButton) {
    discordReloadButton.addEventListener('click', async () => {
      const response = await fetch('/data/discord/reload/commands', { method: 'POST' });
      const result = await response.json();
      if (result.success) window.location.reload();
    });
  }

  const minecraftReloadButton = document.getElementById('internal_button_reload_commands_minecraft');
  if (minecraftReloadButton) {
    minecraftReloadButton.addEventListener('click', async () => {
      const response = await fetch('/data/minecraft/reload/commands', { method: 'POST' });
      const result = await response.json();
      if (result.success) window.location.reload();
    });
  }

  const exportConfigButton = document.getElementById('internal_button_export_config');
  if (exportConfigButton) {
    exportConfigButton.addEventListener('click', async () => {
      const response = await fetch('/data/config/export');
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
  }

  const inputConfigButton = document.getElementById('internal_button_input_config');
  if (inputConfigButton) {
    inputConfigButton.addEventListener('click', async () => {
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
  }

  const internalGoToChannelsButton = document.getElementById(
    'internal_button_go_to_config_discord_commands_update-channels'
  );
  if (internalGoToChannelsButton) {
    internalGoToChannelsButton.addEventListener('click', () => {
      window.location.href = '/config/discord/commands/update-channels';
    });
  }

  const reloadGuildDataButton = document.getElementById('reload-guild-data');
  if (reloadGuildDataButton) {
    reloadGuildDataButton.addEventListener('click', async () => {
      const response = await fetch('/data/discord/server?bypass=true');
      const result = await response.json();
      if (result.success) window.location.reload();
    });
  }

  update();
});
