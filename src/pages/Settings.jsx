import { useEffect, useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useAsync } from '../hooks/useAsync';
import { getSettings, saveSettings } from '../services/api';
import { cn } from '../lib/utils';

function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <span className="mt-1.5 block text-xs text-red-500">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

function Toggle({ checked, onChange, label, description, disabled = false }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3.5">
      <div>
        <p className="text-xs font-medium text-ink">{label}</p>
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'focus-ring relative h-5 w-9 shrink-0 rounded-full transition-colors disabled:opacity-50',
          checked ? 'bg-brand-600' : 'bg-line',
        )}
      >
        {/* left/top anchor the knob explicitly: without `left`, the knob falls back to the
            button's centred static position and drifts outside the track. */}
        <span
          className={cn(
            'absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0',
          )}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const { toast } = useToast();

  const { data, loading, error, reload } = useAsync(() => getSettings(), []);

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Seed the editable copy once the stored settings arrive.
  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const update = (key) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [key]: value }));
  };

  const setPref = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));

  const save = async () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Enter the name shown on reports.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      const saved = await saveSettings({ ...form, name: form.name.trim(), email: form.email.trim() });
      setForm(saved);
      toast('Settings saved');
    } catch (saveError) {
      toast(saveError.message || 'Settings could not be saved');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Settings" description="Workspace preferences and report delivery." />

      {error ? (
        <Card className="max-w-3xl">
          <ErrorState onRetry={reload} description="Your settings could not be loaded." />
        </Card>
      ) : loading || !form ? (
        <div className="grid max-w-3xl gap-4">
          <Skeleton className="h-[236px] w-full rounded-xl" />
          <Skeleton className="h-[248px] w-full rounded-xl" />
        </div>
      ) : (
        <div className="grid max-w-3xl gap-4">
          <Card>
            <CardHeader title="Profile" description="Shown on exported reports" />
            <CardBody className="space-y-4">
              <Field label="Full name" error={errors.name}>
                <Input value={form.name} onChange={update('name')} disabled={saving} />
              </Field>
              <Field label="Email" hint="Reports are delivered here." error={errors.email}>
                <Input type="email" value={form.email} onChange={update('email')} disabled={saving} />
              </Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Notifications" />
            <CardBody className="divide-y divide-line py-1">
              <Toggle
                label="Weekly summary"
                description="Every Monday at 08:00 in your timezone."
                checked={form.weekly}
                onChange={setPref('weekly')}
                disabled={saving}
              />
              <Toggle
                label="Revenue anomalies"
                description="Alert when daily revenue moves more than 20%."
                checked={form.anomalies}
                onChange={setPref('anomalies')}
                disabled={saving}
              />
              <Toggle
                label="Dark theme"
                description="Also follows your system setting on first visit."
                checked={isDark}
                onChange={toggleTheme}
              />
            </CardBody>
          </Card>

          <div className="flex justify-end">
            <Button onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
