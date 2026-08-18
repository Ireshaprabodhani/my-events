"use client"

import { useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { submitRsvpSchema, type SubmitRsvpInput } from "@/lib/validations/rsvp"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/shared/loading-spinner"

interface RsvpFormProps {
  invitationId: string
  guestFirstName: string
  plusOneAllowed: boolean
}

const RESPONSES = [
  { value: "ATTENDING", label: "Yes, I will attend" },
  { value: "NOT_ATTENDING", label: "Sorry, I cannot attend" },
  { value: "MAYBE", label: "Maybe" },
] as const

export function RsvpForm({ invitationId, guestFirstName, plusOneAllowed }: RsvpFormProps) {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<SubmitRsvpInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(submitRsvpSchema) as Resolver<SubmitRsvpInput>,
    defaultValues: { invitationId },
  })

  const selectedResponse = form.watch("response")

  async function onSubmit(data: SubmitRsvpInput) {
    try {
      const res = await fetch("/api/public/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to submit RSVP")
      setSubmitted(true)
    } catch {
      form.setError("root", { message: "Something went wrong. Please try again." })
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg bg-muted p-6 text-center space-y-2">
        <p className="text-lg font-semibold">Thank you, {guestFirstName}!</p>
        <p className="text-muted-foreground text-sm">
          Your response has been recorded. We look forward to celebrating with you.
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {form.formState.errors.root && (
          <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
        )}

        <FormField
          control={form.control}
          name="response"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Will you attend?</FormLabel>
              <FormControl>
                <div className="grid gap-2">
                  {RESPONSES.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      className={`w-full rounded-lg border p-3 text-left text-sm font-medium transition-colors ${
                        field.value === option.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedResponse === "ATTENDING" && plusOneAllowed && (
          <FormField
            control={form.control}
            name="plusOneName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plus one name (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Name of your guest" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedResponse === "ATTENDING" && (
          <FormField
            control={form.control}
            name="dietaryNeeds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dietary requirements (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Vegetarian, Vegan, Nut allergy..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message to the host (optional)</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Leave a message..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting || !selectedResponse}
        >
          {form.formState.isSubmitting && <LoadingSpinner className="mr-2 h-4 w-4" />}
          Submit RSVP
        </Button>
      </form>
    </Form>
  )
}
