'use client';

import type { ReactNode } from 'react';
import { BusinessNameField } from './BusinessNameField';
import { PhoneField } from './PhoneField';
import { DescriptionField } from './DescriptionField';

interface GeneralInfoSectionProps {
  businessName: string;
  phone: string;
  description: string;
  onBusinessNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

/**
 * Sección de información general
 * Desktop: agrupa nombre, teléfono y descripción
 */
export function GeneralInfoSection({
  businessName,
  phone,
  description,
  onBusinessNameChange,
  onPhoneChange,
  onDescriptionChange,
}: GeneralInfoSectionProps): ReactNode {
  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white font-poppins mb-6">
        Información General
      </h2>
      <div className="space-y-6">
        <BusinessNameField value={businessName} onChange={onBusinessNameChange} />
        <PhoneField value={phone} onChange={onPhoneChange} />
        <DescriptionField value={description} onChange={onDescriptionChange} />
      </div>
    </div>
  );
}

