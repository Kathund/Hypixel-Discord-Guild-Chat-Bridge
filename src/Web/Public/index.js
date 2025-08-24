/* eslint-disable hypixelDiscordGuildChatBridge/enforce-no-console-log */
let changed = false;
const originalValues = new Map();

function update() {
  const saveChanges = document.getElementById('saveChanges');
  if (saveChanges) {
    if (changed) {
      saveChanges.classList.remove('translate-y-16');
    } else {
      saveChanges.classList.add('translate-y-16');
    }
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

    if (input.dataset.optionType === 'stringSelect' && input.dataset.prefill !== undefined) {
      const response = await fetch(`/data/discord/server`);
      console.log(response.status);
      const data = await response.json();
      try {
        if (!data.success) return alert(data.message);
        const setId = input.dataset.value;
        switch (input.dataset.prefill) {
          case 'prefill_roles': {
            data.data.roles.forEach((role) => {
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
            data.data.channels.forEach((channel) => {
              input.appendChild(
                Object.assign(document.createElement('option'), {
                  value: channel.id,
                  textContent: channel.name,
                  disabled: [1, 2, 3, 4, 5, 10, 13, 14, 15, 16].includes(channel.type),
                  selected: channel.id === setId
                })
              );
            });
            break;
          }
          case 'prefill_members': {
            data.data.members.forEach((member) => {
              input.appendChild(
                Object.assign(document.createElement('option'), {
                  value: member.id,
                  textContent: `@${member.username}`,
                  disabled: member.bot,
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

  document.getElementById('reload-guild-data').addEventListener('click', async () => {
    const response = await fetch(`/data/discord/server?bypass=true`);
    const result = await response.json();
    if (result.success) window.location.reload();
  });

  update();
});
