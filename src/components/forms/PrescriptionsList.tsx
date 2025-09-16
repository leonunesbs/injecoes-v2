"use client";

import * as React from "react";

import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  Table as TanStackTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Plus,
  Settings2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import {
  createPatientPdfBlob,
  fillPatientPdfTemplateWithData,
  generateMultiplePrescriptionsPdf,
  type PatientData,
} from "~/utils/patientPdfGenerator";

type Prescription = Prisma.PrescriptionGetPayload<{
  include: {
    patient: {
      select: {
        id: true;
        refId: true;
        name: true;
        balanceOD: true;
        balanceOS: true;
        totalPrescribedOD: true;
        totalPrescribedOS: true;
        totalAppliedOD: true;
        totalAppliedOS: true;
      };
    };
    indication: {
      select: {
        id: true;
        name: true;
        code: true;
      };
    };
    medication: {
      select: {
        id: true;
        name: true;
        code: true;
        activeSubstance: true;
      };
    };
    swalis: {
      select: {
        id: true;
        name: true;
        code: true;
      };
    };
    doctor: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;

interface PrescriptionsListProps {
  prescriptions: Prescription[];
}

// Utility function to convert prescriptions data to CSV
function convertToCSV(prescriptions: Prescription[]): string {
  const headers = [
    "Nome do Paciente",
    "ID do Paciente",
    "Indicação",
    "Código da Indicação",
    "Medicação",
    "Código da Medicação",
    "Substância Ativa",
    "Prescrito OD",
    "Prescrito OE",
    "Médico",
    "Data da Prescrição",
  ];

  const rows = prescriptions.map((prescription) => [
    prescription.patient.name,
    prescription.patient.refId,
    prescription.indication?.name || "",
    prescription.indication?.code || "",
    prescription.medication?.name || "",
    prescription.medication?.code || "",
    prescription.medication?.activeSubstance || "",
    prescription.prescribedOD,
    prescription.prescribedOS,
    prescription.doctor?.name ?? "",
    prescription.createdAt.toLocaleDateString("pt-BR"),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");

  return csvContent;
}

// Utility function to download CSV file
function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// DataTableViewOptions component for column visibility toggle
function DataTableViewOptions<TData>({
  table,
}: {
  table: TanStackTable<TData>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-9 px-3 lg:flex"
        >
          <Settings2 className="mr-2 h-4 w-4" />
          Colunas
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Alternar colunas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// DataTableToolbar component for filtering and search
function DataTableToolbar({
  table,
  prescriptions,
}: {
  table: TanStackTable<Prescription>;
  prescriptions: Prescription[];
}) {
  const [alertDialog, setAlertDialog] = React.useState<{
    open: boolean;
    title: string;
    description: string;
  }>({
    open: false,
    title: "",
    description: "",
  });
  // Get unique indications for the filter dropdown
  const uniqueIndications = React.useMemo(() => {
    const indications = prescriptions
      .map((p) => p.indication)
      .filter(
        (indication): indication is NonNullable<typeof indication> =>
          indication !== null,
      );

    const unique = indications.filter(
      (indication, index, self) =>
        index === self.findIndex((i) => i.id === indication.id),
    );

    return unique;
  }, [prescriptions]);

  const handleDownloadCSV = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;

    let dataToExport;
    if (selectedRows.length > 0) {
      // Se há linhas selecionadas, exporta apenas essas
      dataToExport = selectedRows.map((row) => row.original);
    } else {
      // Se não há seleção, exporta todos os resultados filtrados
      dataToExport = table
        .getFilteredRowModel()
        .rows.map((row) => row.original);
    }

    const csvContent = convertToCSV(dataToExport);
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `prescricoes_${timestamp}.csv`;

    downloadCSV(csvContent, filename);
  };

  const handleGeneratePDF = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;

    // Como o botão só é habilitado quando há seleções, sempre usa as prescrições selecionadas
    const dataToExport = selectedRows.map((row) => row.original);

    try {
      // Load the PDF template
      const modelPDFBytes = await fetch("/modeloAA.pdf").then((res) =>
        res.arrayBuffer(),
      );

      if (dataToExport.length === 1) {
        // Single prescription - use the existing function
        const prescription = dataToExport[0];
        if (!prescription) {
          throw new Error("Prescrição não encontrada");
        }
        const patientData: PatientData = {
          refId: prescription.patient.refId,
          name: prescription.patient.name,
          indication: prescription.indication?.name ?? "",
          medication: prescription.medication?.name ?? "",
          swalisClassification: "",
          observations: prescription.notes ?? "",
          remainingOD: prescription.prescribedOD,
          remainingOS: prescription.prescribedOS,
          startEye: prescription.prescribedOD > 0 ? "OD" : "OS",
        };

        const pdfBytes = await fillPatientPdfTemplateWithData(
          patientData,
          modelPDFBytes,
        );
        const blobUrl = createPatientPdfBlob(pdfBytes);

        // Open PDF in new window
        const newWindow = window.open(blobUrl, "_blank");
        if (!newWindow) {
          setAlertDialog({
            open: true,
            title: "Pop-up bloqueado",
            description: "Por favor, permita pop-ups para visualizar o PDF.",
          });
        }
      } else {
        // Multiple prescriptions - use the new function
        const pdfBytes = await generateMultiplePrescriptionsPdf(
          dataToExport,
          modelPDFBytes,
        );
        const blobUrl = createPatientPdfBlob(pdfBytes);

        // Open PDF in new window
        const newWindow = window.open(blobUrl, "_blank");
        if (!newWindow) {
          setAlertDialog({
            open: true,
            title: "Pop-up bloqueado",
            description: "Por favor, permita pop-ups para visualizar o PDF.",
          });
        }
      }
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      setAlertDialog({
        open: true,
        title: "Erro ao gerar PDF",
        description:
          "Erro ao gerar PDF. Verifique o console para mais detalhes.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
      {/* Search and Filter Row */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Input
          placeholder="Buscar por nome ou prontuário..."
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="w-full sm:w-80"
        />
        <Select
          value={
            (table.getColumn("indication")?.getFilterValue() as string) ?? ""
          }
          onValueChange={(value) =>
            table
              .getColumn("indication")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por indicação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as indicações</SelectItem>
            {uniqueIndications.map((indication) => (
              <SelectItem key={indication.id} value={indication.id}>
                {indication.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions Row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 lg:gap-4">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="text-muted-foreground text-center text-sm sm:text-left md:block">
            <span className="hidden lg:inline">
              {table.getFilteredSelectedRowModel().rows.length} de{" "}
              {table.getFilteredRowModel().rows.length} linhas selecionadas
            </span>
            <span className="hidden sm:inline lg:hidden">
              {table.getFilteredSelectedRowModel().rows.length} selecionadas
            </span>
            <span className="sm:hidden">
              {table.getFilteredSelectedRowModel().rows.length} itens
            </span>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCSV}
            disabled={table.getFilteredSelectedRowModel().rows.length === 0}
            className="h-9 flex-1 px-3 sm:flex-none"
          >
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Download CSV</span>
            <span className="sm:hidden">CSV</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGeneratePDF}
            disabled={table.getFilteredSelectedRowModel().rows.length === 0}
            className="h-9 flex-1 px-3 sm:flex-none"
          >
            <FileText className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Gerar PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>

      <AlertDialog
        open={alertDialog.open}
        onOpenChange={(open) => setAlertDialog({ ...alertDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setAlertDialog({ ...alertDialog, open: false })}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// DataTablePagination component for pagination controls
function DataTablePagination({
  table,
}: {
  table: TanStackTable<Prescription>;
}) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const totalResults = table.getFilteredRowModel().rows.length;
  const totalCoreResults = table.getCoreRowModel().rows.length;
  const pageSize = table.getState().pagination.pageSize;

  return (
    <div className="flex flex-col gap-3 px-1 sm:gap-4 sm:px-2 md:flex-row md:items-center md:justify-between">
      {/* Informações e controles de página */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:gap-6">
        {/* Seletor de itens por página */}
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm font-medium">
            <span className="xs:inline hidden">Linhas por página</span>
            <span className="xs:hidden">Por página</span>
          </p>
          <Select
            value={pageSize === totalResults ? "all" : `${pageSize}`}
            onValueChange={(value) => {
              if (value === "all") {
                table.setPageSize(totalResults);
              } else {
                table.setPageSize(Number(value));
              }
            }}
          >
            <SelectTrigger className="h-8 w-[90px] sm:w-[100px]">
              <SelectValue
                placeholder={
                  pageSize === totalResults ? "Ver todos" : pageSize.toString()
                }
              />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 15, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
              <SelectItem key="all" value="all">
                Ver todos
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Informação da página atual */}
        <div className="flex items-center justify-center sm:justify-start">
          <p className="text-muted-foreground text-sm font-medium">
            <span className="hidden sm:inline">
              Página {currentPage} de {totalPages}
            </span>
            <span className="sm:hidden">
              {currentPage}/{totalPages}
            </span>
          </p>
        </div>

        {/* Contador de resultados */}
        <div className="flex items-center justify-center sm:justify-start">
          <p className="text-muted-foreground text-sm font-medium">
            <span className="hidden md:inline">
              {totalResults} de {totalCoreResults} resultados
            </span>
            <span className="hidden sm:inline md:hidden">
              {totalResults} resultados
            </span>
            <span className="sm:hidden">{totalResults} itens</span>
          </p>
        </div>
      </div>

      {/* Controles de navegação */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 md:justify-end">
        {/* Botão primeira página - apenas desktop */}
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 xl:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          aria-label="Ir para primeira página"
        >
          <ChevronFirst className="h-4 w-4" />
        </Button>

        {/* Botão página anterior */}
        <Button
          variant="outline"
          className="h-8 w-8 p-0 sm:h-9 sm:w-9"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Ir para página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Indicador de página atual em telas pequenas */}
        <div className="flex items-center justify-center px-3 sm:hidden">
          <span className="text-foreground text-sm font-medium">
            {currentPage}
          </span>
        </div>

        {/* Botão próxima página */}
        <Button
          variant="outline"
          className="h-8 w-8 p-0 sm:h-9 sm:w-9"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Ir para próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Botão última página - apenas desktop */}
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 xl:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          aria-label="Ir para última página"
        >
          <ChevronLast className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

const columns: ColumnDef<Prescription>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    accessorFn: (row) => row.patient.name,
    header: "Paciente",
    cell: ({ row }) => (
      <div>
        <Link
          href={`/patients/${row.original.patient.id}`}
          className="font-medium hover:underline"
        >
          {row.original.patient.name}
        </Link>
        <div className="text-muted-foreground text-sm">
          ID: {row.original.patient.refId}
        </div>
      </div>
    ),
  },
  {
    id: "indication",
    accessorFn: (row) => row.indication?.id,
    header: "Indicação",
    cell: ({ row }) => (
      <div>
        <Link
          href={`/prescriptions/${row.original.id}`}
          className="font-medium hover:underline"
        >
          {row.original.indication?.name}
        </Link>
        <div className="text-muted-foreground text-sm">
          {row.original.indication?.code}
        </div>
      </div>
    ),
  },
  {
    id: "medication",
    accessorFn: (row) => row.medication?.name,
    header: "Medicação",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.medication?.name}</div>
        <div className="text-muted-foreground text-sm">
          {row.original.medication?.code} -{" "}
          {row.original.medication?.activeSubstance}
        </div>
      </div>
    ),
  },
  {
    id: "prescribedOD",
    accessorKey: "prescribedOD",
    header: "Prescrito OD",
    cell: ({ row }) => (
      <span className="font-mono font-medium">
        {row.getValue("prescribedOD")}
      </span>
    ),
  },
  {
    id: "prescribedOS",
    accessorKey: "prescribedOS",
    header: "Prescrito OE",
    cell: ({ row }) => (
      <span className="font-mono font-medium">
        {row.getValue("prescribedOS")}
      </span>
    ),
  },
  {
    id: "doctor",
    accessorFn: (row) => row.doctor?.name,
    header: "Médico",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.doctor?.name ?? "N/A"}</div>
    ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Data",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {row.original.createdAt.toLocaleDateString("pt-BR")}
      </div>
    ),
  },
];

function PrescriptionsTable({ prescriptions }: PrescriptionsListProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useReactTable({
    data: prescriptions,
    columns,
    enableRowSelection: true,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue: string) => {
      const search = filterValue.toLowerCase();
      const name = String(row.original.patient.name ?? "");
      const refId = row.original.patient.refId || "";
      const doctorName = String(row.original.doctor?.name ?? "");

      return (
        name.toLowerCase().includes(search) ||
        refId.toLowerCase().includes(search) ||
        doctorName.toLowerCase().includes(search)
      );
    },
    state: {
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
      rowSelection,
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="bg-background rounded-md border p-4">
        <DataTableToolbar table={table} prescriptions={prescriptions} />
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhuma prescrição encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center py-3 sm:justify-end sm:py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="text-muted-foreground mb-4">
        Nenhuma prescrição encontrada
      </div>
      <Link href="/prescriptions/new">
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Criar primeira prescrição
        </Button>
      </Link>
    </div>
  );
}

export function PrescriptionsList({ prescriptions }: PrescriptionsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prescrições Realizadas</CardTitle>
      </CardHeader>
      <CardContent>
        {prescriptions.length === 0 ? (
          <EmptyState />
        ) : (
          <PrescriptionsTable prescriptions={prescriptions} />
        )}
      </CardContent>
    </Card>
  );
}
