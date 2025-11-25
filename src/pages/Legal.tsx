import { PublicLayout } from '@/layouts/PublicLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Legal = () => {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 font-display text-4xl font-bold">Legal Information</h1>

          <Tabs defaultValue="terms" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="terms">Terms of Service</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
              <TabsTrigger value="rewards">Reward Terms</TabsTrigger>
            </TabsList>

            <TabsContent value="terms">
              <Card className="border-2 p-8">
                <h2 className="mb-6 font-display text-2xl font-bold">Terms of Service</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-sm text-muted-foreground">Last updated: January 2024</p>
                  
                  <section>
                    <h3 className="mb-2 font-semibold text-foreground">1. Acceptance of Terms</h3>
                    <p>
                      By accessing and using StudyEarn, you accept and agree to be bound by these Terms
                      of Service. If you do not agree to these terms, please do not use our platform.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-semibold text-foreground">2. User Accounts</h3>
                    <p>
                      You are responsible for maintaining the confidentiality of your account credentials
                      and for all activities that occur under your account. You must notify us immediately
                      of any unauthorized use.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-semibold text-foreground">3. Learning Activities</h3>
                    <p>
                      All learning activities must be completed authentically. Any attempts to cheat,
                      manipulate verification systems, or submit false evidence will result in account
                      suspension and forfeiture of rewards.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-semibold text-foreground">4. Intellectual Property</h3>
                    <p>
                      All content, courses, and materials on StudyEarn are protected by intellectual
                      property rights. You may not reproduce, distribute, or create derivative works
                      without explicit permission.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-semibold text-foreground">5. Limitation of Liability</h3>
                    <p>
                      StudyEarn shall not be liable for any indirect, incidental, special, consequential,
                      or punitive damages resulting from your use of the platform.
                    </p>
                  </section>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card className="border-2 p-8">
                <h2 className="mb-6 font-display text-2xl font-bold">Privacy Policy</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-sm text-muted-foreground">Last updated: January 2024</p>

                  <section>
                    <h3 className="mb-2 font-semibold text-foreground">Information We Collect</h3>
                    <p>
                      We collect information you provide directly to us, including name, email, learning
                      progress, submission evidence, and payment information. We also collect usage data
                      and device information automatically.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-semibold text-foreground">How We Use Your Information</h3>
                    <p>
                      Your information is used to provide and improve our services, process rewards and
                      payments, verify learning activities, communicate with you, and analyze platform
                      usage for improvements.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-semibold text-foreground">Information Sharing</h3>
                    <p>
                      We do not sell your personal information. We may share information with instructors
                      for course delivery, payment processors for transactions, and as required by law.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-semibold text-foreground">Data Security</h3>
                    <p>
                      We implement industry-standard security measures to protect your data. However, no
                      method of transmission over the internet is 100% secure.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-semibold text-foreground">Your Rights</h3>
                    <p>
                      You have the right to access, correct, delete, or export your personal data. You
                      can exercise these rights through your account settings or by contacting support.
                    </p>
                  </section>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="rewards">
              <Card className="border-2 p-8">
                <h2 className="mb-6 font-display text-2xl font-bold">Reward Terms & Conditions</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-sm text-muted-foreground">Last updated: January 2024</p>

                  <section>
                    <h3 className="mb-2 font-semibold text-foreground">Earning Rewards</h3>
                    <p>
                      Rewards are earned through verified completion of learning activities including
                      lessons, quizzes, assignments, and study sessions. All activities must be completed
                      authentically to qualify for rewards.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-semibold text-foreground">Verification Requirements</h3>
                    <p>
                      Some activities require verification through proctored sessions, instructor review,
                      or evidence submission. Failure to meet verification requirements will result in
                      reward denial.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-semibold text-foreground">Withdrawal Terms</h3>
                    <p>
                      Minimum withdrawal amount is $10. Processing times vary by payment method (1-5
                      business days). Withdrawal fees may apply depending on the selected method.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-semibold text-foreground">Redemption Policy</h3>
                    <p>
                      Marketplace items can be redeemed using earned points. Redemptions are final and
                      non-refundable. Item availability and fulfillment times may vary.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-semibold text-foreground">Reward Forfeiture</h3>
                    <p>
                      Rewards may be forfeited in cases of fraudulent activity, terms violation, or
                      account termination. StudyEarn reserves the right to audit and reverse suspicious
                      transactions.
                    </p>
                  </section>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Legal;
