'use client';
 
import { useEffect, useRef, useState } from 'react';
 
interface Props {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  onChange: (v: number) => void;
  label?: string;
  labelId?: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  borderColor?: string;
}
 
export default function StepperButton({
  value, onDecrement, onIncrement, onChange,
  label, labelId, min, max, step, unit = '%',
  borderColor = 'var(--sections-text)'
}: Props) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));
  const [announcement, setAnnouncement] = useState('');
 
  const inputValueRef = useRef(inputValue);
  const onChangeRef = useRef(onChange);
  const onDecrementRef = useRef(onDecrement);
  const onIncrementRef = useRef(onIncrement);
  const skipBlurRef = useRef(false);
 
  useEffect(() => { inputValueRef.current = inputValue; }, [inputValue]);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { onDecrementRef.current = onDecrement; }, [onDecrement]);
  useEffect(() => { onIncrementRef.current = onIncrement; }, [onIncrement]);
 
  useEffect(() => {
    if (!editing) setInputValue(String(value));
  }, [value, editing]);
 
  const commitInput = () => {
    const parsed = parseFloat(inputValueRef.current);
 
    if (!isNaN(parsed)) {
      const finalValue = Math.min(max, Math.max(min, parsed));
      onChangeRef.current(finalValue);
      setAnnouncement(`Saved. ${label} set to ${finalValue}${unit}`);
    } else {
      setInputValue(String(value));
      setAnnouncement(`Invalid entry. Reverted to ${value}${unit}`);
    }
 
    setEditing(false);
    setTimeout(() => setAnnouncement(''), 3000);
  };
 
  const handleBlur = () => {
    if (skipBlurRef.current) return;
    commitInput();
  };
 
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitInput();
    } else if (e.key === 'Escape') {
      setEditing(false);
      setInputValue(String(value));
      setAnnouncement('Changes cancelled');
    }
  };
 
  const handleStepperMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    skipBlurRef.current = true;
  };
 
  const handleDecrement = () => {
    skipBlurRef.current = false;
    if (editing) commitInput();
    onDecrementRef.current();
  };
 
  const handleIncrement = () => {
    skipBlurRef.current = false;
    if (editing) commitInput();
    onIncrementRef.current();
  };
 
  return (
    <div
      role="group"
      aria-labelledby={labelId}
      style={{ display: 'inline-flex', alignItems: 'center', border: `3px solid ${borderColor}`, backgroundColor: 'var(--white-bg)', position: 'relative' }}
    >
      <div aria-live="assertive" className='sr-only'>
        {announcement}
      </div>
 
      <button
        type="button"
        onMouseDown={handleStepperMouseDown}
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
        style={{ width: '2.5em', height: '2.5em', backgroundColor: value <= min ? '#4A4A68' : 'var(--primary)', color: '#F5F7FA', border: 'none', cursor: value <= min ? 'not-allowed' : 'pointer'}}
      >
        -
      </button>
 
      {editing ? (
        <input
          type="text"
          inputMode={step % 1 === 0 ? "numeric" : "decimal"}
          className="stepper-no-arrows"
          value={inputValue}
          onChange={(e) => {
            let val = e.target.value;
            if (step % 1 === 0) {
              val = val.replace(/[^0-9]/g, '');
            } else {
              val = val.replace(/[^0-9.]/g, '');
              if ((val.match(/\./g) || []).length > 1) return;
            }
            setInputValue(val);
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{ width: '4em', height: '2.5em', textAlign: 'center', border: 'none', outline: '3px solid var(--primary)', color: '#292942'}}
        />
      ) : (
        <button
          type="button"
          aria-label={`${label} is ${value}${unit}. Click to type value.`}
          onClick={() => setEditing(true)}
          style={{ minWidth: '3.5em', height: '2.5em', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold', color: '#292942'}}
        >
          {value}{unit}
        </button>
      )}
 
      <button
        type="button"
        onMouseDown={handleStepperMouseDown}
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label={`Increase ${label}`}
        style={{ width: '2.5em', height: '2.5em', backgroundColor: value >= max ? '#4A4A68' : 'var(--primary)', color: '#F5F7FA', border: 'none', cursor: value >= max ? 'not-allowed' : 'pointer', justifyContent: 'center' }}
      >
        +
      </button>
    </div>
  );
}