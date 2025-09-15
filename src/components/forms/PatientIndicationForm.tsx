"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Prisma } from "@prisma/client";
import React, { useCallback, useState } from "react";
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
import { Textarea } from "~/components/ui/textarea";
import {
  patientIndicationSchema,
  type PatientIndicationFormData,
} from "~/lib/schemas/patient";
import { api } from "~/trpc/react";

interface PatientIndicationFormProps {
  onSubmit: (data: PatientIndicationFormData) => void;
  defaultValues?: Partial<PatientIndicationFormData>;
  isLoading?: boolean;
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
      activeSubstance: true;
    };
  }>[];
  swalisClassifications: Prisma.SwalisClassificationGetPayload<{
    select: {
      id: true;
      code: true;
      name: true;
      description: true;
    };
  }>[];
}

export function PatientIndicationForm({
  onSubmit,
  isLoading = false,
  indications,
  medications,
  swalisClassifications,
}: PatientIndicationFormProps) {
  const [availableIndications] = useState(indications);
  const [showIndicationOther, setShowIndicationOther] = useState(false);
  const [showMedicationOther, setShowMedicationOther] = useState(false);
  const [showODOther, setShowODOther] = useState(false);
  const [showOEOther, setShowOEOther] = useState(false);

  const form = useForm<PatientIndicationFormData>({
    resolver: zodResolver(patientIndicationSchema),
    defaultValues: {
      patientRefId: 0,
      patientName: "",
      indicationId: "",
      indicationOther: "",
      medicationId: "",
      medicationOther: "",
      swalisId: "",
      observations: "",
      indicationOD: 0,
      indicationOE: 0,
      startWithOD: true,
    },
  });

  // Data is now passed as props from server-side

  // Watch patient refId for automatic search
  const patientRefId = form.watch("patientRefId");
  const [shouldSearch, setShouldSearch] = useState(false);

  // Query to search patient by refId
  const { data: foundPatient } = api.patient.getByRefId.useQuery(
    { refId: patientRefId },
    {
      enabled: shouldSearch && patientRefId > 0,
      retry: false,
    },
  );

  // Update patient name when patient is found
  React.useEffect(() => {
    if (foundPatient?.name) {
      form.setValue("patientName", foundPatient.name);
    }
    // Don't clear the name field if no patient is found - let user keep what they typed
  }, [foundPatient, form]);

  // Handle patient refId input change with debounce
  React.useEffect(() => {
    if (patientRefId > 0) {
      const timeoutId = setTimeout(() => {
        setShouldSearch(true);
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    } else {
      // Only clear search state, don't clear the name field
      setShouldSearch(false);
    }
  }, [patientRefId]);

  // Handle indication other toggle
  const handleIndicationOtherToggle = useCallback(() => {
    const newShowOther = !showIndicationOther;
    setShowIndicationOther(newShowOther);

    if (newShowOther) {
      // Switching to "Other" mode - clear indicationId
      form.setValue("indicationId", "");
    } else {
      // Switching back to normal mode - clear indicationOther
      form.setValue("indicationOther", "");
    }
  }, [showIndicationOther, form]);

  // Handle medication other toggle
  const handleMedicationOtherToggle = useCallback(() => {
    const newShowOther = !showMedicationOther;
    setShowMedicationOther(newShowOther);

    if (newShowOther) {
      // Switching to "Other" mode - clear medicationId
      form.setValue("medicationId", "");
    } else {
      // Switching back to normal mode - clear medicationOther
      form.setValue("medicationOther", "");
    }
  }, [showMedicationOther, form]);

  // Handle indication selection
  const handleIndicationChange = useCallback(
    (indicationId: string) => {
      form.setValue("indicationId", indicationId);
      // Clear other indication field when selecting a normal indication
      form.setValue("indicationOther", "");
      setShowIndicationOther(false);
    },
    [form],
  );

  // Handle medication selection
  const handleMedicationChange = useCallback(
    (medicationId: string) => {
      form.setValue("medicationId", medicationId);
      // Clear other medication field when selecting a normal medication
      form.setValue("medicationOther", "");
      setShowMedicationOther(false);
    },
    [form],
  );

  // Handle swalis selection
  const handleSwalisChange = useCallback(
    (swalisId: string) => {
      form.setValue("swalisId", swalisId);
    },
    [form],
  );

  // Handle OD quantity selection
  const handleODQuantityChange = useCallback(
    (quantity: number) => {
      form.setValue("indicationOD", quantity);
      setShowODOther(false);
    },
    [form],
  );

  // Handle OE quantity selection
  const handleOEQuantityChange = useCallback(
    (quantity: number) => {
      form.setValue("indicationOE", quantity);
      setShowOEOther(false);
    },
    [form],
  );

  // Handle OD other toggle
  const handleODOtherToggle = useCallback(() => {
    const newShowOther = !showODOther;
    setShowODOther(newShowOther);

    if (newShowOther) {
      // Switching to "Other" mode - clear indicationOD
      form.setValue("indicationOD", 0);
    }
  }, [showODOther, form]);

  // Handle OE other toggle
  const handleOEOtherToggle = useCallback(() => {
    const newShowOther = !showOEOther;
    setShowOEOther(newShowOther);

    if (newShowOther) {
      // Switching to "Other" mode - clear indicationOE
      form.setValue("indicationOE", 0);
    }
  }, [showOEOther, form]);

  // Handle start with selection
  const handleStartWithChange = useCallback(
    (startWithOD: boolean) => {
      form.setValue("startWithOD", startWithOD);
    },
    [form],
  );

  // Watch form values for better UX
  const selectedIndicationId = form.watch("indicationId");
  const selectedMedicationId = form.watch("medicationId");
  const selectedSwalisId = form.watch("swalisId");

  // Get selected items for descriptions
  const selectedIndication = availableIndications.find(
    (ind) => ind.id === selectedIndicationId,
  );
  const selectedMedication = medications.find(
    (med) => med.id === selectedMedicationId,
  );
  const selectedSwalis = swalisClassifications.find(
    (swalis) => swalis.id === selectedSwalisId,
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {/* Patient ID */}
          <FormField
            control={form.control}
            name="patientRefId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID do Paciente *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o ID do paciente (apenas números)"
                    {...field}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow digits
                      if (/^\d*$/.test(value)) {
                        field.onChange(parseInt(value) || 0);
                      }
                    }}
                    value={field.value || ""}
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </FormControl>
                <FormDescription>
                  Digite o ID numérico do paciente
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Patient Name (auto-filled or manual) */}
          <FormField
            control={form.control}
            name="patientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Paciente *</FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      foundPatient
                        ? "Nome preenchido automaticamente"
                        : "Digite o nome do paciente"
                    }
                    {...field}
                    readOnly={!!foundPatient}
                    className={foundPatient ? "bg-muted" : ""}
                  />
                </FormControl>
                <FormDescription>
                  {foundPatient
                    ? "Nome preenchido automaticamente baseado no ID"
                    : "Digite o nome do paciente se não encontrado automaticamente"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Indication - Radio Buttons */}
        <FormField
          control={form.control}
          name="indicationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Indicação Médica *</FormLabel>
              <FormDescription className="mb-4">
                Selecione a condição médica que justifica o tratamento
              </FormDescription>
              <div className="flex flex-wrap gap-2">
                {availableIndications.map((indication) => (
                  <Button
                    key={indication.id}
                    type="button"
                    variant={
                      field.value === indication.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleIndicationChange(indication.id)}
                    className="h-9 min-w-[70px] text-xs sm:h-10 sm:min-w-[80px] sm:text-sm"
                  >
                    {indication.code}
                  </Button>
                ))}

                <Button
                  type="button"
                  variant={showIndicationOther ? "default" : "outline"}
                  size="sm"
                  onClick={handleIndicationOtherToggle}
                  className="h-9 min-w-[80px] border-dashed text-xs sm:h-10 sm:min-w-[100px] sm:text-sm"
                >
                  Outro
                </Button>
              </div>

              {selectedIndication && !showIndicationOther && (
                <div className="bg-accent/50 mt-2 rounded-md p-3">
                  <div className="text-foreground text-sm font-medium">
                    {selectedIndication.code} - {selectedIndication.name}
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    Indicação selecionada para o tratamento
                  </div>
                </div>
              )}

              {showIndicationOther && (
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="indicationOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indicação Personalizada *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o nome da indicação personalizada"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Digite o nome da indicação que não está na lista
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Medication - Radio Buttons */}
        <FormField
          control={form.control}
          name="medicationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medicação *</FormLabel>
              <FormDescription className="mb-4">
                Selecione o medicamento a ser utilizado no tratamento
              </FormDescription>
              <div className="flex flex-wrap gap-2">
                {medications.map((medication) => (
                  <Button
                    key={medication.id}
                    type="button"
                    variant={
                      field.value === medication.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleMedicationChange(medication.id)}
                    className="h-9 min-w-[70px] text-xs sm:h-10 sm:min-w-[80px] sm:text-sm"
                  >
                    {medication.code}
                  </Button>
                ))}

                <Button
                  type="button"
                  variant={showMedicationOther ? "default" : "outline"}
                  size="sm"
                  onClick={handleMedicationOtherToggle}
                  className="h-9 min-w-[80px] border-dashed text-xs sm:h-10 sm:min-w-[100px] sm:text-sm"
                >
                  Outro
                </Button>
              </div>

              {selectedMedication && !showMedicationOther && (
                <div className="bg-accent/50 mt-2 rounded-md p-3">
                  <div className="text-foreground text-sm font-medium">
                    {selectedMedication.code} - {selectedMedication.name}
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    Princípio ativo: {selectedMedication.activeSubstance}
                  </div>
                </div>
              )}

              {showMedicationOther && (
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="medicationOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medicação Personalizada *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o nome da medicação personalizada"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Digite o nome da medicação que não está na lista
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Swalis Classification - Radio Buttons */}
        <FormField
          control={form.control}
          name="swalisId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Classificação Swalis *</FormLabel>
              <FormDescription className="mb-4">
                Selecione a classificação de prioridade segundo Swalis
              </FormDescription>
              <div className="flex flex-wrap gap-2">
                {swalisClassifications.map((swalis) => (
                  <Button
                    key={swalis.id}
                    type="button"
                    variant={field.value === swalis.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSwalisChange(swalis.id)}
                    className="h-9 min-w-[70px] text-xs sm:h-10 sm:min-w-[80px] sm:text-sm"
                  >
                    {swalis.code}
                  </Button>
                ))}
              </div>

              {selectedSwalis && (
                <div className="bg-accent/50 mt-2 rounded-md p-3">
                  <div className="text-foreground text-sm font-medium">
                    {selectedSwalis.code}
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    {selectedSwalis.description}
                  </div>
                </div>
              )}

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {/* Indications OD - Radio Buttons */}
          <FormField
            control={form.control}
            name="indicationOD"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Injeções Prescritas OD</FormLabel>
                <FormDescription className="mb-3 sm:mb-4">
                  {selectedIndication
                    ? `Injeções para OD no tratamento de ${selectedIndication.name}`
                    : "Número de injeções a serem adicionadas ao restante do olho direito"}
                </FormDescription>
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3].map((quantity) => (
                    <Button
                      key={quantity}
                      type="button"
                      variant={
                        field.value === quantity && !showODOther
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleODQuantityChange(quantity)}
                      className="h-9 min-w-[40px] text-xs sm:h-10 sm:min-w-[50px] sm:text-sm"
                    >
                      {quantity}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant={showODOther ? "default" : "outline"}
                    size="sm"
                    onClick={handleODOtherToggle}
                    className="h-9 min-w-[70px] border-dashed text-xs sm:h-10 sm:min-w-[80px] sm:text-sm"
                  >
                    Outro
                  </Button>
                </div>

                {showODOther && (
                  <div className="mt-4">
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Digite a quantidade"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription className="mt-1">
                      Digite a quantidade personalizada de injeções
                    </FormDescription>
                  </div>
                )}

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Indications OE - Radio Buttons */}
          <FormField
            control={form.control}
            name="indicationOE"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Injeções Prescritas OE</FormLabel>
                <FormDescription className="mb-3 sm:mb-4">
                  {selectedIndication
                    ? `Injeções para OE no tratamento de ${selectedIndication.name}`
                    : "Número de injeções a serem adicionadas ao restante do olho esquerdo"}
                </FormDescription>
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3].map((quantity) => (
                    <Button
                      key={quantity}
                      type="button"
                      variant={
                        field.value === quantity && !showOEOther
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleOEQuantityChange(quantity)}
                      className="h-9 min-w-[40px] text-xs sm:h-10 sm:min-w-[50px] sm:text-sm"
                    >
                      {quantity}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant={showOEOther ? "default" : "outline"}
                    size="sm"
                    onClick={handleOEOtherToggle}
                    className="h-9 min-w-[70px] border-dashed text-xs sm:h-10 sm:min-w-[80px] sm:text-sm"
                  >
                    Outro
                  </Button>
                </div>

                {showOEOther && (
                  <div className="mt-4">
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Digite a quantidade"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription className="mt-1">
                      Digite a quantidade personalizada de injeções
                    </FormDescription>
                  </div>
                )}

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Start with - Radio Buttons */}
        <FormField
          control={form.control}
          name="startWithOD"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Começar por</FormLabel>
              <FormDescription className="mb-3 sm:mb-4">
                Selecione por qual olho o tratamento deve começar
              </FormDescription>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={field.value === true ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStartWithChange(true)}
                  className="h-9 min-w-[70px] text-xs sm:h-10 sm:min-w-[80px] sm:text-sm"
                >
                  OD
                </Button>
                <Button
                  type="button"
                  variant={field.value === false ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStartWithChange(false)}
                  className="h-9 min-w-[70px] text-xs sm:h-10 sm:min-w-[80px] sm:text-sm"
                >
                  OE
                </Button>
              </div>
              <FormDescription className="mt-2">
                {field.value
                  ? "O tratamento começará pelo olho direito (OD)"
                  : "O tratamento começará pelo olho esquerdo (OE)"}
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

        <Button
          type="submit"
          className="h-11 w-full sm:h-12"
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Prescrever Injeções"}
        </Button>
      </form>
    </Form>
  );
}
