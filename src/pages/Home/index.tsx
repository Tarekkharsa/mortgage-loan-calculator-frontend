import { DataTable } from "@/components/custom-table";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export type ExtraRepaymentSchedule = {
  month_number: number;
  starting_balance: number;
  monthly_payment: number;
  principal_component: number;
  interest_component: number;
  extra_repayment_made: number;
  ending_balance_after_extra_repayment: number;
  remaining_loan_term_after_extra_repayment: number;
};
const extraRepaymentData: ExtraRepaymentSchedule[] = [];

export const ExtraRepaymentScheduleColumns: ColumnDef<ExtraRepaymentSchedule>[] =
  [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));

        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

export type AmortizationSchedule = {
  month_number: number;
  starting_balance: number;
  monthly_payment: number;
  principal_component: number;
  interest_component: number;
  ending_balance: number;
};
const amortizationScheduleData: AmortizationSchedule[] = [];

export const AmortizationScheduleColumns: ColumnDef<AmortizationSchedule>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "month_number",
    header: "month_number",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("month_number")}</div>
    ),
  },
  {
    accessorKey: "starting_balance",
    header: "starting_balance",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("starting_balance")}</div>
    ),
  },
  {
    accessorKey: "monthly_payment",
    header: "monthly_payment",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("monthly_payment")}</div>
    ),
  },
  {
    accessorKey: "principal_component",
    header: "principal_component",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("principal_component")}</div>
    ),
  },
  {
    accessorKey: "interest_component",
    header: "interest_component",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("interest_component")}</div>
    ),
  },
  {
    accessorKey: "ending_balance",
    header: "ending_balance",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("ending_balance")}</div>
    ),
  },
];

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});
export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <div className="container mx-auto mt-8">
      <div className=" shadow-lg rounded-lg p-6">
        <div className="  p-6  flex justify-center items-center flex-col m-auto">
          <div className="flex justify-end w-full">
            <ModeToggle />
          </div>
          <h2 className="text-2xl font-bold mb-4">Mortgage Loan Calculator</h2>

          {/* Loan input form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-[60%]"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>

        {/* Amortization Schedule */}
        <h3 className="text-xl font-bold mb-4">Amortization Schedule</h3>
        <DataTable
          columns={AmortizationScheduleColumns}
          data={amortizationScheduleData}
        />

        {/* Extra Repayment Schedule */}
        <h3 className="text-xl font-bold mb-4">Extra Repayment Schedule</h3>
        <DataTable
          columns={ExtraRepaymentScheduleColumns}
          data={extraRepaymentData}
        />
      </div>
    </div>
  );
}
