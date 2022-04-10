import React from 'react';
import './faq.css';

function faq() {
  return (
    <>
      <div className="faq" id="faq">
        <div className="questionsHeader">
          <h1 className="QHh1">FAQ</h1>
        </div>
        <div className="c">
          <input type="checkbox" id="faq-1" />
          <h1 className="question">
            <label htmlFor="faq-1">What does Kemosabe mean?</label>
          </h1>
          <div className="answer">
            <p>Kemosabe is “Good Friend”</p>
          </div>
        </div>
        <div className="c">
          <input type="checkbox" id="faq-2" />
          <h1 className="question">
            <label htmlFor="faq-2">How to mint?</label>
          </h1>
          <div className="answer">
            <p>
              You can mint Kemosabe by connecting Metamask or other web3 wallet and proceed with the
              transaction.
            </p>
          </div>
        </div>
        <div className="c">
          <input type="checkbox" id="faq-3" />
          <h1 className="question">
            <label htmlFor="faq-3">How can you download Metamask wallet?</label>
          </h1>
          <div className="answer">
            <p>
              You can find it at <a href="https://metamask.io/">metamask.io</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default faq;
