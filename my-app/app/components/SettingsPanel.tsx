'use client';
 
import { ChevronUp, RotateCcw } from 'lucide-react';
import { useSettings, MIN, MAX, STEP } from '@/app/context/SettingsContext';
import StepperButton from './StepperButton';
 
export default function SettingsPanel() {
  const { settings, toggleTheme, setTextSize, setContrast, isOpen, togglePanel, resetToDefaults, isDefault } = useSettings();
 
  if (!isOpen) return null;

  const panelContainerStyle: React.CSSProperties = {
    position: 'relative',
    backgroundColor: 'var(--secondary-bg)',
    borderBottom: '3px solid var(--blue-accent)',
    paddingBottom: '0px',
    boxShadow: '0px 4px 4px -1px rgba(0, 0, 0, 0.1)',
    zIndex: 100,
  };

  const resetWrapperStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    padding: '12px 0 8px',
  };

  const resetButtonStyle: React.CSSProperties = {
    display: 'flex',
    gap: '6px',
    padding: '0.4em 1em',
    borderRadius: '15px',
    border: '3px solid var(--main-text)',
    backgroundColor: 'transparent',
    color: 'var(--sections-text)',
  };

  const mainGridStyle: React.CSSProperties = {
    maxWidth: '1000px',
    width: '90%',
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    padding: '4px 0',
    justifyContent: 'center',
  };

  const sectionContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    flex: '1 1 220px',
  };

  const headingStyle: React.CSSProperties = {
    margin: '4px 0',
  };

  const controlsRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const switchTrackStyle: React.CSSProperties = {
    position: 'relative',
    width: '40px',
    height: '22px',
    borderRadius: '20px',
    border: '2px solid var(--main-text)',
    backgroundColor: settings.theme === 'dark' ? 'var(--primary)' : '#292942',
    transition: 'background-color 0.2s',
    padding: 0,
    overflow: 'hidden',
  };

  const switchThumbStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: settings.theme === 'dark' ? 'calc(100% - 18px)' : '2px',
    transform: 'translateY(-50%)',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#F5F7FA',
    transition: 'left 0.2s ease-in-out',
  };

  const tabContainerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    transform: 'translateY(100%)',
    zIndex: 100,
  };

  const closeButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 16px',
    border: '3px solid var(--blue-accent)',
    borderRadius: '0 0 20px 20px',
    backgroundColor: 'var(--blue-to-black)',
    color: 'var(--white-to-blue)',
  };
 
  return (
    <div id="settings-panel" role="region" aria-label="Accessibility settings" style={panelContainerStyle}>
      <div style={{ paddingBottom: '8px' }}>
        {!isDefault && (
          <div style={resetWrapperStyle}>
            <button onClick={resetToDefaults} style={resetButtonStyle}>
              <RotateCcw size={16} aria-hidden="true" />
              Reset to defaults
            </button>
          </div>
        )}
 
        <div style={mainGridStyle}>
          <div style={sectionContainerStyle}>
            <h3 id="appearance-heading" style={headingStyle}>Appearance</h3>
            <div style={controlsRowStyle}>
              <span id="dark-mode-text" style={{ color: 'var(--sections-text)' }}>Dark mode</span>
              <button 
                role="switch" 
                aria-checked={settings.theme === 'dark'} 
                aria-labelledby="dark-mode-text" 
                onClick={toggleTheme} 
                style={switchTrackStyle}
              >
                <span style={switchThumbStyle} />
              </button>
              <span aria-hidden="true" style={{ color: 'var(--sections-text)' }}>
                {settings.theme === 'dark' ? 'On' : 'Off'}
              </span>
            </div>
          </div>
 
          <div style={sectionContainerStyle}>
            <h3 id="text-size-label" style={headingStyle}>Text size</h3>
            <StepperButton
              label="text size"
              labelId="text-size-label"
              value={settings.textSize}
              min={MIN} max={MAX} step={STEP}
              onIncrement={() => {
                const nextStep = Math.floor(settings.textSize / STEP) * STEP + STEP;
                setTextSize(nextStep);
              }}
              onDecrement={() => {
                const prevStep = Math.ceil(settings.textSize / STEP) * STEP - STEP;
                setTextSize(prevStep);
              }}
              onChange={(newVal) => setTextSize(newVal)}
            />
          </div>
 
          <div style={sectionContainerStyle}>
            <h3 id="contrast-label" style={headingStyle}>Contrast</h3>
            <StepperButton
              label="contrast"
              labelId="contrast-label"
              value={settings.contrast}
              min={MIN} max={MAX} step={STEP}
              onIncrement={() => {
                const nextStep = Math.floor(settings.contrast / STEP) * STEP + STEP;
                setContrast(nextStep);
              }}
              onDecrement={() => {
                const prevStep = Math.ceil(settings.contrast / STEP) * STEP - STEP;
                setContrast(prevStep);
              }}
              onChange={(newVal) => setContrast(newVal)}
            />
          </div>
        </div>
      </div>

      <div style={tabContainerStyle}>
        <button 
          onClick={togglePanel} 
          aria-label="Close settings" 
          aria-expanded={isOpen} 
          style={closeButtonStyle}
        >
          <ChevronUp size={16} aria-hidden="true" />
          Close settings
        </button>
      </div>
    </div>
  );
}