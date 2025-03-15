<template>
  <div class="page">
    <div id="content">
      <n-h1><n-text type="primary">Frequently Asked Questions (FAQ)</n-text></n-h1>

      <n-p>Welcome to the FAQ page! Below, you’ll find answers to common questions about our platform, financial planning
        concepts, and how to use the various tools available.</n-p>

      <n-h2 id="general-questions"><n-text type="primary">General Questions</n-text></n-h2>
      <n-ul>
        <n-li><strong>What is this platform about?</strong><br>
          This platform is designed to help users understand and plan their financial future. We provide interactive
          tools, simulations, and educational content to guide users through various financial topics such as investing,
          saving, and retirement planning.
        </n-li>
        <n-li><strong>Who is this platform for?</strong><br>
          This platform is for anyone looking to learn about financial planning, whether you are a beginner or someone
          experienced in investing who wants more in-depth tools and analysis.
        </n-li>
        <n-li><strong>Is this platform free to use?</strong><br>
          Yes! Many features of this platform are free. However, in the future, there may be premium features for
          advanced
          financial planning.
        </n-li>
      </n-ul>

      <n-h2 id="financial-concepts-and-tools"><n-text type="primary">Financial Concepts & Tools</n-text></n-h2>
      <n-ul>
        <n-li><strong>What is a tax-deferred account?</strong><br>
          A tax-deferred account is an investment account where taxes on earnings are postponed until withdrawals are
          made. Examples include 401(k)s and traditional IRAs.
        </n-li>
        <n-li><strong>What is a Roth IRA?</strong><br>
          A Roth IRA is a retirement account where contributions are made with after-tax dollars, and qualified
          withdrawals in retirement are tax-free.
        </n-li>
        <n-li><strong>How does debt impact my financial plan?</strong><br>
          Debt can affect your ability to save and invest. Our platform offers a debt simulator to help visualize
          different repayment strategies.
        </n-li>
        <n-li><strong>What is an emergency fund, and how much should I save?</strong><br>
          An emergency fund is a savings account meant to cover unexpected expenses. A general rule is to save 3-6
          months'
          worth of living expenses.
        </n-li>
        <n-li><strong>What investment strategies does this platform support?</strong><br>
          Our platform allows you to explore different strategies, including fixed contributions, percentage-based
          savings, and maxing out employer match options.
        </n-li>
      </n-ul>

      <n-h2 id="using-the-platform"><n-text type="primary">Using the Platform</n-text></n-h2>
      <n-ul>
        <n-li><strong>How do I use the financial calculators?</strong><br>
          Our calculators allow you to input your financial details and see projections for savings, investments, and
          retirement. You can adjust variables like income, expenses, and growth rates to test different scenarios.
        </n-li>
        <n-li><strong>How often is the platform updated?</strong><br>
          We are constantly improving the platform by adding new features and refining calculations. Updates will be
          posted in our changelog.
        </n-li>
        <n-li><strong>Where can I get support?</strong><br>
          If you have additional questions, you can visit our support page or reach out via email.
        </n-li>
      </n-ul>

      <n-h2 id="future-features-and-roadmap"><n-text type="primary">Future Features & Roadmap</n-text></n-h2>
      <n-ul>
        <n-li><strong>Are there plans to add more investment types?</strong><br>
          Yes! We plan to introduce more investment models, such as real estate investing and dividend portfolio
          analysis.
        </n-li>
        <n-li><strong>Can I request a feature?</strong><br>
          Absolutely! We welcome feedback and feature requests through our contact form.
        </n-li>
      </n-ul>

      <n-p>Still have questions? Contact us for more details!</n-p>
    </div>
    <n-anchor id="right-side-menu" :show-rail="true">
      <n-anchor-link title="General Questions" href="#general-questions"/>
      <n-anchor-link title="Financial Concepts & Tools" href="#financial-concepts-and-tools"/>
      <n-anchor-link title="Using The Platform" href="#using-the-platform"/>
      <n-anchor-link title="Future Features & Roadmap" href="#future-features-and-roadmap"/>
    </n-anchor>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: 'content',
  title: 'Frequently Asked Questions',
})

</script>
<style scoped>
#content {

}

#right-side-menu {
  position: fixed;
  top: 4rem;
  right: 0;
  width: 12rem;
}
</style>