import {tr, textAttribute, setText, cloudMessage, type CloudText} from './cloudLocalization'
type Entry = { id: string; type: 'account' | 'email'; value: string }
type AccessList = { entries: Entry[]; administrators: string[] }
type API = (path: string, method?: string, body?: unknown) => Promise<any>

export async function renderTestAccess(section: HTMLElement, api: API, report: (message: CloudText) => void) {
  const description = document.createElement('p')
  setText(description, tr("Only invited users can sign in to this test environment. Add an existing account ID or invite a new user by email. An email invitation becomes account access after the first verified sign-in."))
  const form = document.createElement('form')
  form.className = 'cloud-auth-fields'
  const typeLabel = document.createElement('label'); setText(typeLabel, tr("Access type"))
  const type = document.createElement('select')
  for (const [value, label] of [['email', tr('Email invitation')] as const, ['account', tr('Account ID')] as const]) {
    const option = document.createElement('option'); option.value = value!; setText(option, label!); type.append(option)
  }
  typeLabel.append(type)
  const valueLabel = document.createElement('label'); setText(valueLabel, tr("Email or account ID"))
  const value = document.createElement('input'); value.required = true; value.maxLength = 320
  value.type = 'email'; value.placeholder = 'tester@example.com'; value.autocomplete = 'off'
  type.onchange = () => { value.type = type.value === 'email' ? 'email' : 'text'; textAttribute(value, 'placeholder', type.value === 'email' ? 'tester@example.com' : tr('Account UUID')); value.value = '' }
  valueLabel.append(value)
  const add = document.createElement('button'); add.type = 'submit'; setText(add, tr("Grant access")); add.className = 'header-buttons'
  form.append(typeLabel, valueLabel, add)
  const list = document.createElement('div')
  const refresh = document.createElement('button'); refresh.type = 'button'; setText(refresh, tr("Refresh access list")); refresh.className = 'header-buttons-github cloud-secondary'
  section.append(description, form, refresh, list)

  const update = async () => {
    const result: AccessList = await api('/admin/test-access')
    list.replaceChildren()
    const heading = document.createElement('h3'); setText(heading, tr("Allowed users and pending invitations")); list.append(heading)
    if (!result.entries.length) {
      const empty = document.createElement('p'); setText(empty, tr("No invitations or user grants. Only configured administrators can sign in.")); list.append(empty)
    }
    for (const entry of result.entries) {
      const row = document.createElement('article')
      const text = document.createElement('p'); setText(text, tr("{0}: {1}", () => (entry.type === 'email' ? cloudMessage("Email invitation") : cloudMessage("Account")), () => (entry.value)))
      const remove = document.createElement('button'); remove.type = 'button'; setText(remove, tr("Revoke access")); remove.className = 'header-buttons-github cloud-secondary'
      if (entry.type === 'account' && result.administrators.includes(entry.value)) { remove.disabled = true; setText(remove, tr("Configured administrator")) }
      remove.onclick = async () => {
        remove.disabled = true
        try { await api('/admin/test-access/' + encodeURIComponent(entry.id), 'DELETE'); await update(); report(tr("Access revoked. New sign-ins and session renewals are blocked; existing access tokens expire within 15 minutes.")) }
        catch (error) { report(error instanceof Error ? error.message : tr("Could not revoke access")); remove.disabled = false }
      }
      row.append(text, remove); list.append(row)
    }
    const admins = document.createElement('p'); setText(admins, tr("Administrators: {0}. Administrator access is configured by the server operator.", () => (result.administrators.join(', ') || cloudMessage('None')))); list.append(admins)
  }
  form.onsubmit = async event => {
    event.preventDefault(); add.disabled = true
    try { await api('/admin/test-access', 'POST', { type: type.value, value: value.value }); value.value = ''; await update(); report(tr("Access granted.")) }
    catch (error) { report(error instanceof Error ? error.message : tr("Could not grant access")) }
    finally { add.disabled = false }
  }
  refresh.onclick = async () => {
    refresh.disabled = true
    try { await update() } catch (error) { report(error instanceof Error ? error.message : tr("Could not load access list")) }
    finally { refresh.disabled = false }
  }
  await update()
}
