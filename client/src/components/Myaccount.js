import React, { Component } from "react";
import Header from "./Header";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Modal from "./modal";
import api from "../config/api";
import { getClientRequestConfig } from "../config/requestConfig";
import Preloader from "./Preloader";
import { loadUser, updateUser } from "../store/users";
import { loadBookings, updateBooking, bookingUpadte } from "../store/bookings";
import { connect } from "react-redux";

//frame motion

import { motion, Variant } from "framer-motion";

class Myaccount extends Component {
  constructor() {
    super();
    this.state = {
      loader: true,
      cancelModal: false,
      modalShow: false,
      setModalShow: false,
      update: true,
      Summary: [],
      orderDetails: {},
      bookingData: [],
      cancel: {
        cancelReason: "",
        cancelID: "",
      },
      user: {},
      payment: "",
      pincode: "",
      isopen: true,
    };
    // this.FetchBooking = this.FetchBooking.bind(this);
    this.FetchUser = this.FetchUser.bind(this);
  }

  //     FetchBooking = async () =>
  //    (

  //      await api.get("/booking/info",getClientRequestConfig()).then( async (Response) => {

  //         await this.setState({bookingData:Response.data})

  //       }).catch(err =>
  //       {
  //           console.log(err.response.data);
  //       })
  // )

  FetchUser = async () =>
    await this.setState({
      user: {
        fname: this.props.users.fname,
        lname: this.props.users.lname,
        notes: this.props.users.notes,
        email: this.props.users.email,
        address: this.props.users.address,
        phoneNo: this.props.users.phoneNo,
        city: this.props.users.city,
        state: this.props.users.state,
        zipcode: this.props.users.zipcode,
      },
      pincode: this.props.users.zipcode,
    });

  async componentDidMount() {
    await this.props.getBookings();
    await this.props.loaduser();
    await this.setState({ token: localStorage.getItem("auth_token") });
    // await this.FetchBooking();
    await this.FetchUser();
    this.setState({ loader: false });
  }

  render() {
    const cancelOrder = async (event) => {
      event.preventDefault();
      // this.setState({loader:true});
      let button = event.target;
      let bookingid = {
        id: this.state.cancel.cancelID,
        rejectReason: this.state.cancel.cancelReason,
      };
      this.setState({ cancelModal: false });
      await this.props.cancleOrder(bookingid);
      button.remove();
      toast.success(this.props.BookingMessage);
      // api.put("/booking/update", bookingid ,getClientRequestConfig()).then( async (Response) =>
      //  {
      //    toast.success("canceled");
      //   //  console.log(Response.data);
      //    button.remove();
      //    await this.FetchBooking();
      //    this.setState({loader:false});

      // }).catch(err =>
      // {
      //     console.log(err);
      //     this.setState({loader:false});
      // })
    };

    const orderSummary = async (booking, fulldata) => {
      await this.setState({ Summary: booking, orderDetails: fulldata });
      this.setState({ modalShow: true });
    };

    const variants = {
      open: {
        y: 0,
        opacity: 1,
        transition: {
          y: { stiffness: 1000, velocity: -100 },
        },
      },
      closed: {
        y: 50,
        opacity: 0,
        transition: {
          y: { stiffness: 1000 },
        },
      },
    };

    const Table = ({ tableData }) => {
      return (
        <motion.tr
          initial={{
            y:1,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity:1,
          }}
          transition={{
            y: { stiffness: 1000, velocity: -100 },
          }}
        >
          <td scope="row" data-label="Booking Id">
            {tableData._id}
          </td>
          <td data-label="Order Summary">
            <Button
              variant="primary btn-sm"
              onClick={() => orderSummary(tableData.bookingUnits, tableData)}
            >
              View
            </Button>
          </td>
          <td data-label="Amount">{tableData.payments.amount}</td>
          <td data-label="Payment status">
            {tableData.payments.paymentStatus}
          </td>
          <td data-label="order status">
            <div>{tableData.bookingStatus}</div>{" "}
            {tableData.bookingStatus !== "Accecpted" &&
              tableData.bookingStatus !== "Canceled" &&
              tableData.bookingStatus !== "sorry canceled by owner" &&
              tableData.bookingStatus !== "completed" && (
                <Button
                  onClick={() =>
                    this.setState({
                      cancel: { ...this.state.cancel, cancelID: tableData._id },
                      cancelModal: true,
                    })
                  }
                  variant="primary btn-sm"
                >
                  Cancel
                </Button>
              )}
          </td>
        </motion.tr>
      );
    };

    const updateForm = async () => {
      if (this.state.update) {
        this.setState({ update: false });
      } else {
        this.setState({ update: true });
        const user = {
          email: this.state.user.email,
          fname: this.state.user.fname,
          lname: this.state.user.lname,
          notes: this.state.user.notes,
          address: this.state.user.address,
          phoneNo: this.state.user.phoneNo,
          city: this.state.user.city,
          state: this.state.user.state,
          zipcode: this.state.pincode,
        };
        await this.props.updateuser(user);
        toast.success(this.props.userMessage);
      }
    };

    return (
      <div>
        {this.state.modalShow && (
          <Modal
            closeModal={() => {
              this.setState({ modalShow: false });
            }}
          >
            <div className="model-summary-header">
              <div>
                <div className="choose-heading ">
                  <h3>service name</h3>
                </div>
                <div>{this.state.orderDetails.serviceId.serviceName}</div>
              </div>
              <div>
                <div className="choose-heading ">
                  <h3>pick up date</h3>
                </div>
                <div>{this.state.orderDetails.pickupDate}</div>
              </div>
              <div>
                <div className="choose-heading ">
                  <h3>delivery time date</h3>
                </div>
                <div>{this.state.orderDetails.deliveryDate}</div>
              </div>

              <div>
                <div className="choose-heading d ">
                  <h3>Payment Method</h3>
                </div>
                <div>{this.state.orderDetails.payments.paymentMethod}</div>
              </div>
            </div>
            <div className="tableDiv">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Unit Name</th>
                    <th scope="col">Unit Qty</th>
                    <th scope="col">Sub Price</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.Summary.map((data, index) => (
                    <tr key={index}>
                      <td scope="row" data-label="Unit Name">
                        {data.unitName}
                      </td>
                      <td data-label="Unit Qty">{data.unitQty}</td>
                      <td data-label="Sub Price">
                        {" "}
                        ??? &nbsp;{data.unitQty * data.unitRate}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td>Total</td>
                    <td>??? &nbsp;{this.state.orderDetails.payments.amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <div className="choose-heading ">
                <h3>Special Notes</h3>
              </div>
              <div>{this.state.orderDetails.specialNotes}</div>
            </div>
          </Modal>
        )}

        {this.state.cancelModal && (
          <Modal
            closeModal={() => {
              this.setState({ cancelModal: false });
            }}
          >
            <form onSubmit={cancelOrder}>
              <div className="form-group focused">
                <label
                  className="form-control-label"
                  htmlFor="input-orderCancel"
                >
                  cancel Reason please
                </label>
                <input
                  type="text"
                  id="input-orderCancel"
                  className="form-control form-control-alternative"
                  placeholder="write Here"
                  onChange={(e) =>
                    this.setState({
                      cancel: {
                        ...this.state.cancel,
                        cancelReason: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <Button variant="primary btn-sm" type="submit">
                Submit
              </Button>
            </form>
          </Modal>
        )}
        {this.props.Bookingloading || this.props.userloading ? (
          <Preloader />
        ) : (
          <>
            <Header btn={true} Headertwo={true} />
            <div className="user">
              <div className="choose-heading ">
                <h3>Booking Summary</h3>
              </div>

              <div className="tableDiv">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Booking Id</th>
                      <th scope="col">Order Summary</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Payment status</th>
                      <th scope="col">order status</th>
                    </tr>
                  </thead>
                  <motion.tbody

                  // transition={{delayChildren:0.02,staggerChildren:0.07}}
                  >
                    {this.props.bookings.map((data, index) => (
                      <Table key={index} tableData={data} />
                    ))}
                  </motion.tbody>
                </table>
              </div>

              <div>
                <div className="main-content">
                  <div className="container_account mt-7">
                    <div className="choose-heading ">
                      <h3>My Account information</h3>
                    </div>
                    <div className="row">
                      <div className="col-xl-8 m-auto order-xl-1">
                        <div className="card bg-secondary shadow">
                          <div className="card-header bg-white border-0">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <h3 className="mb-0">My account</h3>
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <form>
                              <h6 className="heading-small text-muted mb-4">
                                User information
                              </h6>
                              <div className="pl-lg-4">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <div className="form-group focused">
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-username"
                                      >
                                        Phone Number
                                      </label>
                                      <input
                                        type="text"
                                        id="input-username"
                                        className="form-control form-control-alternative"
                                        placeholder="Username"
                                        readOnly={this.state.update}
                                        onChange={(e) =>
                                          this.setState({
                                            user: {
                                              ...this.state.user,
                                              phoneNo: e.target.value,
                                            },
                                          })
                                        }
                                        value={this.state.user.phoneNo}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6">
                                    <div className="form-group ">
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-email"
                                      >
                                        Email address
                                      </label>
                                      <input
                                        type="email"
                                        id="input-username"
                                        className="form-control form-control-alternative"
                                        readOnly
                                        placeholder="jesse@example.com"
                                        value={this.state.user.email}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-lg-6">
                                    <div className="form-group focused">
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-first-name"
                                      >
                                        First name
                                      </label>
                                      <input
                                        type="text"
                                        id="input-first-name"
                                        className="form-control form-control-alternative"
                                        readOnly={this.state.update}
                                        placeholder="First name"
                                        onChange={(e) =>
                                          this.setState({
                                            user: {
                                              ...this.state.user,
                                              fname: e.target.value,
                                            },
                                          })
                                        }
                                        value={this.state.user.fname}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6">
                                    <div className="form-group focused">
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-last-name"
                                      >
                                        Last name
                                      </label>
                                      <input
                                        type="text"
                                        id="input-last-name"
                                        className="form-control form-control-alternative"
                                        readOnly={this.state.update}
                                        placeholder="Last name"
                                        onChange={(e) =>
                                          this.setState({
                                            user: {
                                              ...this.state.user,
                                              lname: e.target.value,
                                            },
                                          })
                                        }
                                        value={this.state.user.lname}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr className="my-4" />
                              <h6 className="heading-small text-muted mb-4">
                                Contact information
                              </h6>
                              <div className="pl-lg-4">
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="form-group focused">
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-address"
                                      >
                                        Address
                                      </label>
                                      <input
                                        id="input-address"
                                        className="form-control form-control-alternative"
                                        readOnly={this.state.update}
                                        placeholder="Home Address"
                                        onChange={(e) =>
                                          this.setState({
                                            user: {
                                              ...this.state.user,
                                              address: e.target.value,
                                            },
                                          })
                                        }
                                        value={this.state.user.address}
                                        type="text"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-lg-4">
                                    <div className="form-group focused">
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-city"
                                      >
                                        City
                                      </label>
                                      <input
                                        type="text"
                                        id="input-city"
                                        className="form-control form-control-alternative"
                                        readOnly={this.state.update}
                                        placeholder="City"
                                        onChange={(e) =>
                                          this.setState({
                                            user: {
                                              ...this.state.user,
                                              city: e.target.value,
                                            },
                                          })
                                        }
                                        value={this.state.user.city}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-4">
                                    <div className="form-group focused">
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-country"
                                      >
                                        State
                                      </label>
                                      <input
                                        type="text"
                                        id="input-country"
                                        className="form-control form-control-alternative"
                                        readOnly={this.state.update}
                                        onChange={(e) =>
                                          this.setState({
                                            user: {
                                              ...this.state.user,
                                              state: e.target.value,
                                            },
                                          })
                                        }
                                        placeholder="Country"
                                        value={this.state.user.state}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-4">
                                    <div className="form-group">
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-country"
                                      >
                                        Zip code
                                      </label>
                                      <input
                                        type="number"
                                        id="input-postal-code"
                                        className="form-control form-control-alternative"
                                        readOnly={this.state.update}
                                        placeholder="Postal code"
                                        onChange={(e) => {
                                          this.setState({
                                            pincode: e.target.value,
                                          });
                                        }}
                                        value={this.state.user.pincode}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr className="my-4" />
                              <h6 className="heading-small text-muted mb-4">
                                Notes
                              </h6>
                              <div className="pl-lg-4">
                                <div className="form-group focused">
                                  <label className="heading-small form-control-label float-left">
                                    Every order
                                  </label>
                                  <textarea
                                    rows="4"
                                    className="form-control form-control-alternative"
                                    placeholder="A few words htmlFor orders ..."
                                    readOnly={this.state.update}
                                    onChange={(e) =>
                                      this.setState({
                                        user: {
                                          ...this.state.user,
                                          notes: e.target.value,
                                        },
                                      })
                                    }
                                    value={this.state.user.notes}
                                  />
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  //users
  users: state.entities.user.list,
  userMessage: state.entities.user.message,
  userloading: state.entities.user.loading,
  //bookings
  bookings: state.entities.bookings.list,
  BookingMessage: state.entities.bookings.message,
  Bookingloading: state.entities.bookings.loading,
});
const mapDispatchToProps = (dispatch) => ({
  loaduser: () => dispatch(loadUser()),
  updateuser: (data) => dispatch(updateUser(data)),
  getBookings: () => dispatch(loadBookings()),
  cancleOrder: (data) => dispatch(updateBooking(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Myaccount);
