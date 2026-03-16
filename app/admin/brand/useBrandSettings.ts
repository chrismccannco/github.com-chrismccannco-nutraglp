'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

export function useBrandSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pendingRef = useRef<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings);
  }, []);

  const doSave = useCallback(async (updates: Record<string, string>) => {
    setSaving(true);
    setSaved(false);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, []);

  const update = useCallback((key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    pendingRef.current[key] = value;
    setSaved(false);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const toSave = { ...pendingRef.current };
      pendingRef.current = {};
      doSave(toSave);
    }, 700);
  }, [doSave]);

  const updateMany = useCallback((updates: Record<string, string>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    Object.assign(pendingRef.current, updates);
    setSaved(false);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const toSave = { ...pendingRef.current };
      pendingRef.current = {};
      doSave(toSave);
    }, 700);
  }, [doSave]);

  // Explicit save — flushes any pending debounce immediately.
  // If nothing is pending (debounce already fired), just shows saved feedback.
  const save = useCallback(async () => {
    clearTimeout(saveTimer.current);
    const toSave = { ...pendingRef.current };
    pendingRef.current = {};
    if (Object.keys(toSave).length > 0) {
      await doSave(toSave);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }
  }, [doSave]);

  return { settings, update, updateMany, save, saving, saved };
}
