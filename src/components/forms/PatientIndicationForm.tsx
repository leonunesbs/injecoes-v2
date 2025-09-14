"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Prisma } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import {
  patientIndicationSchema,
  type PatientIndicationFormData,
} from "~/lib/schemas/patient";

interface PatientIndicationFormProps {
  onSubmit: (data: PatientIndicationFormData) => void;
  defaultValues?: Partial<PatientIndicationFormData>;
  isLoading?: boolean;
  patients: Prisma.PatientGetPayload<{
    select: {
      id: true;
      refId: true;
      name: true;
    };
  }>[];
  indications: Prisma.IndicationGetPayload<{
    select: {
      id: true;
      code: true;
      name: true;
    };
  }>[];
  medications: Prisma.MedicationGetPayload<{
    select: {
      id: true;
      code: true;
      name: true;
    };
  }>[];
  swalisClassifications: Prisma.SwalisClassificationGetPayload<{
    select: {
      id: true;
      code: true;
      name: true;
    };
  }>[];
}

export function PatientIndicationForm({
  onSubmit,
  defaultValues,
  isLoading = false,
  patients,
  indications,
  medications,
  swalisClassifications,
}: PatientIndicationFormProps) {
  const form = useForm<PatientIndicationFormData>({
    resolver: zodResolver(patientIndicationSchema),
    defaultValues: {
      patientId: "",
      patientName: "",
      indicationId: "",
      medicationId: "",
      swalisId: "",
      observations: "",
      indicationOD: 0,
      indicationOE: 0,
      startWithOD: true,
      ...defaultValues,
    },
  });

  // Data is now passed as props from server-side

  // Update patient name when patient ID changes
  const selectedPatientId = form.watch("patientId");
  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  // Update form when patient is selected
  React.useEffect(() => {
    if (selectedPatient) {
      form.setValue("patientName", selectedPatient.name);
    }
  }, [selectedPatient, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Patient ID */}
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID do Paciente *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o paciente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.refId} - {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecione o paciente para esta indicação
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Patient Name (auto-filled) */}
          <FormField
            control={form.control}
            name="patientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Paciente *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome será preenchido automaticamente"
                    {...field}
                    readOnly
                    className="bg-muted"
                  />
                </FormControl>
                <FormDescription>
                  Nome preenchido automaticamente baseado no paciente
                  selecionado
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Indication */}
          <FormField
            control={form.control}
            name="indicationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Indicação *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a indicação" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {indications.map((indication) => (
                      <SelectItem key={indication.id} value={indication.id}>
                        {indication.code} - {indication.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Condição médica que justifica o tratamento
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Medication */}
          <FormField
            control={form.control}
            name="medicationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medicação *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a medicação" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {medications.map((medication) => (
                      <SelectItem key={medication.id} value={medication.id}>
                        {medication.code} - {medication.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Medicamento a ser utilizado no tratamento
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Swalis Classification */}
        <FormField
          control={form.control}
          name="swalisId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Classificação Swalis *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a classificação Swalis" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {swalisClassifications.map((swalis) => (
                    <SelectItem key={swalis.id} value={swalis.id}>
                      {swalis.code} - {swalis.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Classificação de prioridade segundo Swalis
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Observations */}
        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observações adicionais sobre o paciente ou tratamento..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Observações opcionais sobre o paciente ou tratamento
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Indications OD */}
          <FormField
            control={form.control}
            name="indicationOD"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Injeções Prescritas OD</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormDescription>
                  Número de injeções a serem adicionadas ao saldo do olho
                  direito
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Indications OE */}
          <FormField
            control={form.control}
            name="indicationOE"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Injeções Prescritas OE</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormDescription>
                  Número de injeções a serem adicionadas ao saldo do olho
                  esquerdo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Start with OD */}
        <FormField
          control={form.control}
          name="startWithOD"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Começar por OD</FormLabel>
                <FormDescription>
                  Se marcado, o tratamento começará pelo olho direito (padrão)
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Prescrever Injeções"}
        </Button>
      </form>
    </Form>
  );
}
