import React from 'react';
import TicketForm from './components/TicketForm';
import SwimmingPoolLayout from 'components/layouts/SwimmingPoolLayout';

function SwimmingPoolTicketPage() {
  return (
    <SwimmingPoolLayout route='/ticket'>
      <TicketForm />
    </SwimmingPoolLayout>
  );
}

export default SwimmingPoolTicketPage;
